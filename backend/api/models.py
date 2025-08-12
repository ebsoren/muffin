from django.db import models
from django.core.validators import EmailValidator
import uuid
import os

def get_image_path(instance, filename):
    """Generate a unique filename for uploaded images"""
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('images', filename)

class AllowedEmail(models.Model):
    """Model to store allowed email addresses"""
    email = models.EmailField(unique=True, validators=[EmailValidator()])
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = "Allowed Email"
        verbose_name_plural = "Allowed Emails"
    
    def __str__(self):
        return self.email

# Create your models here.
class Member(models.Model):
    email = models.EmailField(unique=True, null=True, validators=[EmailValidator()])
    name = models.CharField(max_length=200)
    linkedIn = models.CharField(null=True, max_length=200)
    title = models.CharField(null=True, max_length=200)
    board = models.BooleanField(default=False)
    image = models.CharField(null=True, blank=True, max_length=500, help_text="Supabase media bucket image URL")

class Event(models.Model):
    title = models.CharField(null=True, max_length=200)
    description = models.CharField(null=True, max_length=1000)
    date = models.DateField(null=True)
    location = models.CharField(null=True, max_length=200)
    event_type = models.CharField(max_length=200, default='club')
    image = models.CharField(null=True, blank=True, max_length=500, help_text="Supabase media bucket image URL")