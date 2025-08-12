from django.urls import path
from . import views

urlpatterns = [
    path("health/", views.HealthCheckView.as_view(), name="health-check"),
    
    # Image upload endpoint
    path("upload-image/", views.ImageUploadView.as_view(), name="upload-image"),
    
    # Admin status check endpoint
    path("admin-status/", views.AdminStatusView.as_view(), name="admin-status"),
    
    # Profile update endpoint
    path("profile-update/", views.ProfileUpdateView.as_view(), name="profile-update"),
    
    # Get member by email endpoint
    path("get-member-by-email/", views.GetMemberByEmailView.as_view(), name="get-member-by-email"),
    
    # Member endpoints
    path("members/", views.MemberListView.as_view(), name="members-list"),
    path("members/<int:pk>/", views.MemberDetailView.as_view(), name="member-detail"),
    path("members/board/", views.BoardMemberListView.as_view(), name="board-members-list"),
    path("members/non-board/", views.NonBoardMemberListView.as_view(), name="non-board-members-list"),
    
    # Event endpoints
    path("events/", views.EventListView.as_view(), name="events-list"),
    path("events/<int:pk>/", views.EventDetailView.as_view(), name="event-detail"),
    path("events/club/", views.ClubEventListView.as_view(), name="club-events-list"),
    path("events/featured/", views.FeaturedEventListView.as_view(), name="featured-events-list"),
    path("events/recruiting/", views.RecruitingEventListView.as_view(), name="recruiting-events-list"),
    
    # Allowed Email endpoints
    path("allowed-emails/", views.AllowedEmailListView.as_view(), name="allowed-emails-list"),
    path("allowed-emails/<int:pk>/", views.AllowedEmailDetailView.as_view(), name="allowed-email-detail"),
]