from django.contrib import admin
from .models import Member, Event, AllowedEmail

# Register your models here.
@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'board', 'linkedIn')
    list_filter = ('board',)
    search_fields = ('name', 'title')
    list_editable = ('board',)

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'event_type', 'date', 'location')
    list_filter = ('event_type', 'date')
    search_fields = ('title', 'description', 'location')
    date_hierarchy = 'date'

@admin.register(AllowedEmail)
class AllowedEmailAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_active', 'is_admin')
    list_filter = ('is_active', 'is_admin')
    search_fields = ('email',)
    list_editable = ('is_active', 'is_admin')
