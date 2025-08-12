# api/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Member, Event, AllowedEmail

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = "__all__"
    
    def validate_name(self, value):
        """Validate that the name is not empty and has reasonable length"""
        if not value.strip():
            raise serializers.ValidationError("Name cannot be empty")
        if len(value) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long")
        return value.strip()
    
    def validate_linkedIn(self, value):
        """Validate LinkedIn URL format"""
        if value and not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("LinkedIn must be a valid URL")
        return value

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"
    
    def validate_title(self, value):
        """Validate that the title is not empty and has reasonable length"""
        if not value.strip():
            raise serializers.ValidationError("Title cannot be empty")
        if len(value) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long")
        return value.strip()
    
    def validate_event_type(self, value):
        """Validate that event_type is not empty and is a valid type"""
        if not value or not value.strip():
            raise serializers.ValidationError("Event type is required")
        
        valid_types = ['club', 'recruiting', 'featured']
        if value.strip() not in valid_types:
            raise serializers.ValidationError(f"Event type must be one of: {', '.join(valid_types)}")
        
        return value.strip()
    
    def validate_description(self, value):
        """Validate that the description is not empty"""
        return value.strip() if value else ""
    
    def validate_location(self, value):
        """Validate that the location is not empty"""
        return value.strip() if value else ""
    
    def validate_date(self, value):
        """Validate that the date is properly formatted"""
        if value and isinstance(value, str):
            try:
                from datetime import datetime
                datetime.strptime(value, '%Y-%m-%d')
                return value
            except ValueError:
                raise serializers.ValidationError("Date must be in YYYY-MM-DD format")
        return value

class AllowedEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = AllowedEmail
        fields = ['id', 'email', 'is_active', 'is_admin']

class HealthCheckSerializer(serializers.Serializer):
    pass

class ImageUploadResponseSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    filename = serializers.CharField(required=False)
    url = serializers.URLField(required=False)
    bucket = serializers.CharField(required=False)

class AdminStatusResponseSerializer(serializers.Serializer):
    is_admin = serializers.BooleanField()
    email = serializers.EmailField()

class ProfileUpdateResponseSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    member = MemberSerializer()