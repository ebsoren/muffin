from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from .models import Member, Event, AllowedEmail
from .serializers import (
    MemberSerializer, EventSerializer, AllowedEmailSerializer, HealthCheckSerializer, 
    ImageUploadResponseSerializer, AdminStatusResponseSerializer, ProfileUpdateResponseSerializer
)
import os
import requests
import uuid

class HealthCheckView(generics.GenericAPIView):
    serializer_class = HealthCheckSerializer
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        return Response({'status': 'ok'})

# Image upload endpoint using backend service role key
class ImageUploadView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]  # We'll validate admin status in the view
    serializer_class = ImageUploadResponseSerializer
    
    def post(self, request):
        try:
            # Get file from request
            if 'file' not in request.FILES:
                return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
            
            file = request.FILES['file']
            bucket_type = request.data.get('bucket_type', 'media')  # media, profile, event
            file_id = request.data.get('file_id')
            
            # Validate file type
            if not file.content_type.startswith('image/'):
                return Response({'error': 'File must be an image'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get bucket name based on type
            bucket_map = {
                'media': os.getenv('SUPABASE_MEDIA_BUCKET', 'media'),
                'profile': os.getenv('SUPABASE_PROFILE_BUCKET', 'profile-pics'),
                'event': os.getenv('SUPABASE_EVENT_BUCKET', 'event-images')
            }
            
            bucket_name = bucket_map.get(bucket_type, 'media')
            
            # Generate filename
            file_extension = file.name.split('.')[-1]
            prefix = file_id if file_id else str(uuid.uuid4())
            filename = f"{bucket_type}/{prefix}.{file_extension}"
            
            # Upload to Supabase using service role key (backend only)
            supabase_url = os.getenv('SUPABASE_URL')
            service_role_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
            
            if not supabase_url or not service_role_key:
                return Response({'error': 'Supabase configuration missing'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Upload file to Supabase storage
            upload_url = f"{supabase_url}/storage/v1/object/{bucket_name}/{filename}"
            
            headers = {
                'Authorization': f'Bearer {service_role_key}',
                'Content-Type': file.content_type,
                'Cache-Control': '3600'
            }
            
            # Read file content
            file_content = file.read()
            
            # Make upload request to Supabase
            response = requests.post(
                upload_url,
                headers=headers,
                data=file_content
            )
            
            if response.status_code not in [200, 201]:
                return Response({
                    'error': f'Upload failed: {response.status_code} - {response.text}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Generate public URL
            public_url = f"{supabase_url}/storage/v1/object/public/{bucket_name}/{filename}"
            
            return Response({
                'success': True,
                'filename': filename,
                'url': public_url,
                'bucket': bucket_name
            })
            
        except Exception as e:
            print(f"Error in ImageUploadView: {str(e)}")
            return Response({'error': 'Upload failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Admin status check endpoint using backend service role key
class AdminStatusView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = AdminStatusResponseSerializer
    
    def post(self, request):
        try:
            email = request.data.get('email')
            if not email:
                return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Use service role key to query Supabase allowedemails table
            supabase_url = os.getenv('SUPABASE_URL')
            service_role_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
            
            if not supabase_url or not service_role_key:
                return Response({'error': 'Supabase configuration missing'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Query Supabase allowedemails table using service role key
            query_url = f"{supabase_url}/rest/v1/api_allowedemail?select=is_admin&email=eq.{email}&is_active=eq.true&limit=1"
            
            headers = {
                'apikey': service_role_key,
                'Authorization': f'Bearer {service_role_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(query_url, headers=headers)
            
            if response.status_code != 200:
                return Response({
                    'error': f'Query failed: {response.status_code}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            data = response.json()
            
            if data and len(data) > 0:
                is_admin = data[0].get('is_admin', False)
                return Response({
                    'is_admin': is_admin,
                    'email': email
                })
            else:
                return Response({
                    'is_admin': False,
                    'email': email
                })
                
        except Exception as e:
            print(f"Error in AdminStatusView: {str(e)}")
            return Response({'error': 'Admin status check failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Profile update endpoint for authenticated users
class ProfileUpdateView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]  # We'll validate user existence in the view
    serializer_class = ProfileUpdateResponseSerializer
    
    def post(self, request):
        try:
            email = request.data.get('email')
            if not email:
                return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user exists in allowedemails table
            supabase_url = os.getenv('SUPABASE_URL')
            service_role_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
            
            if not supabase_url or not service_role_key:
                return Response({'error': 'Supabase configuration missing'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Query Supabase allowedemails table to verify user exists
            query_url = f"{supabase_url}/rest/v1/api_allowedemail?select=id&email=eq.{email}&is_active=eq.true&limit=1"
            
            headers = {
                'apikey': service_role_key,
                'Authorization': f'Bearer {service_role_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(query_url, headers=headers)
            
            if response.status_code != 200:
                return Response({
                    'error': f'Query failed: {response.status_code}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            allowed_email_data = response.json()
            
            if not allowed_email_data or len(allowed_email_data) == 0:
                return Response({
                    'error': 'User email not found in allowed emails. Something went wrong.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get or create member record
            member, created = Member.objects.get_or_create(
                email=email,
                defaults={
                    'name': request.data.get('name', ''),
                    'linkedIn': request.data.get('linkedIn', ''),
                    'title': request.data.get('title', ''),
                    'board': False,
                    'image': ''
                }
            )
            
            # Update member data
            member.name = request.data.get('name', member.name)
            member.linkedIn = request.data.get('linkedIn', member.linkedIn)
            member.title = request.data.get('title', member.title)
            
            # Handle image upload if provided
            if 'image' in request.FILES:
                file = request.FILES['image']
                
                # Validate file type
                if not file.content_type.startswith('image/'):
                    return Response({'error': 'File must be an image'}, status=status.HTTP_400_BAD_REQUEST)
                
                # Generate filename using user ID from allowedemails
                user_id = allowed_email_data[0]['id']
                file_extension = file.name.split('.')[-1]
                filename = f"profile/{user_id}.{file_extension}"
                
                # Get profile bucket name
                bucket_name = os.getenv('SUPABASE_PROFILE_BUCKET', 'profile-pics')
                
                # Upload to Supabase using service role key
                upload_url = f"{supabase_url}/storage/v1/object/{bucket_name}/{filename}"
                
                upload_headers = {
                    'Authorization': f'Bearer {service_role_key}',
                    'Content-Type': file.content_type,
                    'Cache-Control': '3600'
                }
                
                # Read file content
                file_content = file.read()
                # Make upload request to Supabase
                upload_response = requests.post(
                    upload_url,
                    headers=upload_headers,
                    data=file_content
                )
                
                if upload_response.status_code not in [200, 201]:
                    return Response({
                        'error': f'Image upload failed: {upload_response.status_code} - {upload_response.text}'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
                member.image = filename
            
            member.save()
            
            # Serialize and return updated member data
            member_serializer = MemberSerializer(member)
            return Response({
                'success': True,
                'member': member_serializer.data
            })
            
        except Exception as e:
            print(f"Error in ProfileUpdateView: {str(e)}")
            return Response({'error': 'Profile update failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Get member by email endpoint
class GetMemberByEmailView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]  # We'll validate user existence in the view
    serializer_class = MemberSerializer
    
    def post(self, request):
        try:
            email = request.data.get('email')
            if not email:
                return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user exists in allowedemails table
            supabase_url = os.getenv('SUPABASE_URL')
            service_role_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
            
            if not supabase_url or not service_role_key:
                return Response({'error': 'Supabase configuration missing'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Query Supabase allowedemails table to verify user exists
            query_url = f"{supabase_url}/rest/v1/api_allowedemail?select=id&email=eq.{email}&is_active=eq.true&limit=1"
            
            headers = {
                'apikey': service_role_key,
                'Authorization': f'Bearer {service_role_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(query_url, headers=headers)
            
            if response.status_code != 200:
                return Response({
                    'error': f'Query failed: {response.status_code}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            allowed_email_data = response.json()
            
            if not allowed_email_data or len(allowed_email_data) == 0:
                return Response({
                    'error': 'User email not found in allowed emails. Something went wrong.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Try to get existing member record
            try:
                member = Member.objects.get(email=email)
                serializer = MemberSerializer(member)
                return Response({
                    'success': True,
                    'member': serializer.data
                })
            except Member.DoesNotExist:
                # Member doesn't exist yet, return empty data
                return Response({
                    'success': True,
                    'member': {
                        'id': None,
                        'email': email,
                        'name': '',
                        'linkedIn': '',
                        'title': '',
                        'board': False,
                        'image': ''
                    }
                })
            
        except Exception as e:
            print(f"Error in GetMemberByEmailView: {str(e)}")
            return Response({'error': 'Failed to get member data'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Existing views
class MemberListView(generics.ListCreateAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    pagination_class = None
    permission_classes = [permissions.AllowAny]

class MemberDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [permissions.AllowAny]

class BoardMemberListView(generics.ListAPIView):
    queryset = Member.objects.filter(board=True)
    serializer_class = MemberSerializer
    pagination_class = None
    permission_classes = [permissions.AllowAny]

class NonBoardMemberListView(generics.ListAPIView):
    queryset = Member.objects.filter(board=False)
    serializer_class = MemberSerializer
    pagination_class = None
    permission_classes = [permissions.AllowAny]

class EventListView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    pagination_class = None
    permission_classes = [permissions.AllowAny]

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]

class ClubEventListView(generics.ListAPIView):
    queryset = Event.objects.filter(event_type='club')
    serializer_class = EventSerializer
    pagination_class = None
    permission_classes = [permissions.AllowAny]

class FeaturedEventListView(generics.ListAPIView):
    queryset = Event.objects.filter(event_type='featured')
    serializer_class = EventSerializer
    pagination_class = None
    permission_classes = [permissions.AllowAny]

class RecruitingEventListView(generics.ListAPIView):
    queryset = Event.objects.filter(event_type='recruiting')
    serializer_class = EventSerializer
    pagination_class = None
    permission_classes = [permissions.AllowAny]

# Allowed Email views
class AllowedEmailListView(generics.ListCreateAPIView):
    queryset = AllowedEmail.objects.all()
    serializer_class = AllowedEmailSerializer
    pagination_class = None
    permission_classes = [permissions.AllowAny]

class AllowedEmailDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AllowedEmail.objects.all()
    serializer_class = AllowedEmailSerializer
    permission_classes = [permissions.AllowAny]