from django.db import models
from django.db.models import Q
from django.contrib.postgres.fields import ArrayField# from simple_history.models import
from imagekit.models import ProcessedImageField, ImageSpecField
from pilkit.processors import ResizeToFit, SmartResize
from django.contrib.auth.models import AbstractUser
from django.utils.encoding import python_2_unicode_compatible
from django.core.urlresolvers import reverse
from django.shortcuts import get_object_or_404
from django.db.models.signals import post_save
from django.dispatch import receiver

from .people import User, Organization
from .assets import SimpleImage, SimpleAudio, SimpleVideo, SimpleDocument
from .story import Story
from .facets import Facet

#-----------------------------------------------------------------------#
#   People:
#   ContractorInfo, OrganizationContractorInfo
#-----------------------------------------------------------------------#


class ContractorInfo(models.Model):
    """A User who is a freelancer or contractor has a ContractorInfo
    record on Facet.

    ContractorInfo tracks additional information about the user as a
    contractor.
    """

    # user account created for the contractor
    user = models.OneToOneField(
        User,
    )

    resume = models.FileField(
        upload_to='resumes/%Y/%m/%d',
        blank=True,
    )

    address = models.TextField(
        blank=True,
        help_text='Mailing address.',
    )

    availability = models.TextField(
        help_text="Notes on when a contractor is available or not.",
        blank=True,
    )

    # differs from user.location
    # user.location is intended as general base. ie. San Francisco
    # current_location is intended for finding contractors that are near
    # a newsworthy thing. ie. "Berkely Campus" during a protest
    current_location = models.TextField(
        help_text="Contractor's specific location.",
        blank=True,
    )

    gear = models.TextField(
        help_text="Gear that a contractor has access to and skills for.",
        blank=True,
    )

    def __str__(self):
        return self.user.credit_name

    def get_absolute_url(self):
        return reverse('contractor_detail', kwargs={'pk': self.id})



class OrganizationContractorInfo(models.Model):
    """Information tracked by an organization about contractors.

    Basic info like email, bio, skillset, availability, current_location, gear
    are available on ContractorInfo.

    The data captured here is intended to reflect an Organization's internal
    notes regarding a Contractor.
    """

    organization = models.ForeignKey(
        "Organization",
    )

    contractor_info = models.ForeignKey(
        "ContractorInfo",
    )

    w9_on_file = models.BooleanField(
        default=False,
        help_text='Does the organization have a W9 on file.',
    )

    rates = models.TextField(
        blank=True,
        help_text='The rates the contractor is paid by the org.',
    )

    strengths = models.TextField(
        blank=True,
        help_text='Internal notes on strengths of the contractor.',
    )

    conflicts = models.TextField(
        blank=True,
        help_text='Any conflicts of interest the contractor has.',
    )

    editor_notes = models.TextField(
        blank=True,
        help_text='Any notes for editors on things to know when working with this contractor.',
    )

    # a contractor in an organizations contractor pool can be available
    # for assigning to projects, stories, and tasks through the regular team picker.
    talent_pool = models.BooleanField(
        default=False,
        help_text='Is this contractor a trusted regular?',
    )

    # status: Is this contractor currently in use?

    # request for running total of assignments contractor has done for an org
    # request for running total of how much an org has paid a contractor
    # request for ability to see mark assignments as paid and sort accordingly

    def __str__(self):
        return "{organization} - {contractor}".format(
                                        organization=self.organization.name,
                                        contractor=self.contractor_info.user.credit_name,
                                        )


class Call(models.Model):
    """Calls are requests from editors/organizations for pitches.

    They contain details for what pitches they are requesting.
    """

    owner = models.ForeignKey(
        User,
        help_text='User that owns this call.'
    )

    organization = models.ForeignKey(
        Organization,
        help_text='Organization that is making this call.'
    )

    name = models.CharField(
        max_length=50,
        help_text='Title of the call.',
    )

    text = models.TextField(
        help_text='Text of the call.',
    )

    creation_date = models.DateTimeField(
        auto_now_add=True,
        help_text='Day/Time call was created.',
        blank=True,
    )

    # optional expiration date for call
    # at this point is_active will set to false automatically
    expiration_date = models.DateTimeField(
        auto_now_add=True,
        help_text='Day/Time call ends.',
        blank=True,
        null=True,
    )

    is_active = models.BooleanField(
        default=True,
        help_text='Is this call active?'
    )

    urgent = models.BooleanField(
        default=False,
        help_text='Is this call urgent?'
    )

    timeframe = models.CharField(
        max_length=100,
        help_text='What is the timeframe for responses?',
        blank=True,
        null=True,
    )

    DRAFT = 'Draft'
    PUBLISHED = 'Published'
    COMPLETE = 'Complete'

    CALL_STATUS_CHOICES = (
        (DRAFT, 'Draft'),
        (PUBLISHED, 'Published'),
        (COMPLETE, 'Complete'),
    )

    # internal draft management. Only published calls are visible
    # to contractors.
    # status is determined by user that owns the call.
    status = models.CharField(
        max_length=25,
        choices=CALL_STATUS_CHOICES,
        help_text='Pitch status choice.'
    )

    def __str__(self):
        return self.name

    # def get_absolute_url(self):
    #     return reverse('call_detail', kwargs={'pk': self.id})

    @property
    def search_title(self):
        return self.name

    @property
    def type(self):
        return "Call"


class Pitch(models.Model):
    """ Pitches for content from a contractor to an Organization."""

    contributor = models.ForeignKey(
        ContractorInfo,
    )

    name = models.TextField(
        help_text='Title of the pitch.',
    )

    text = models.TextField(
        help_text='Text of the pitch.',
    )

    creation_date = models.DateTimeField(
        auto_now_add=True,
        help_text='Day pitch was created.',
        blank=True,
    )

    DRAFT = 'Draft'
    PITCHED = 'Pitched'
    ACCEPTED = 'Accepted'
    COMPLETE = 'Complete'

    PITCH_STATUS_CHOICES = (
        (DRAFT, 'Draft'),
        (PITCHED, 'Pitched'),


        (ACCEPTED, 'Accepted'),
        (COMPLETE, 'Complete'),
    )

    #status is determined by contributor that owns the pitch
    status = models.CharField(
        max_length=25,
        choices=PITCH_STATUS_CHOICES,
        help_text='Pitch status choice.'
    )

    exclusive = models.BooleanField(
        default=False,
        help_text='Is this pitch for an assignment exclusive to the recipient?',
    )

    # assets
    # FIXME waiting on this pending update to BaseAsset where
    # organization is not required as Contractors have no org.
    # image_assets = models.ManyToManyField(
    #     SimpleImage,
    #     blank=True,
    # )
    #
    # document_assets = models.ManyToManyField(
    #     SimpleDocument,
    #     blank=True,
    # )
    #
    # audio_assets = models.ManyToManyField(
    #     SimpleAudio,
    #     blank=True,
    # )
    #
    # video_assets = models.ManyToManyField(
    #     SimpleVideo,
    #     blank=True,
    # )

    def __str__(self):
        return self.name

    @property
    def search_title(self):
        return self.name

    # def get_absolute_url(self):
    #     return reverse('pitch_edit', kwargs={'pk': self.id})

    @property
    def type(self):
        return "Pitch"


class Assignment(models.Model):
    """The details of an assignment to a contractor from an organization."""

    contributor = models.ForeignKey(
        ContractorInfo,
    )

    editor = models.ForeignKey(
        User,
        help_text='Editor responsible for this assignment.',
    )

    organization = models.ForeignKey(
        Organization,
        help_text='Organization that owns this assignment.',
    )

    name = models.TextField(
        help_text='Name of the assignment.',
    )

    text = models.TextField(
        help_text='Details of the assignment.',
    )

    creation_date = models.DateTimeField(
        auto_now_add=True,
        help_text='Day assignment was created.',
        blank=True,
    )

    rate = models.CharField(
        max_length=100,
        help_text='Rate at which the assignment is being completed.',
    )

    # An assignment can be connected to a story, giving the contractor access
    # to all details of the story.
    # OR an assignment can be connected to a specific facet, giving the contractor
    # access to only that facet of the story.
    # The story or facet could be an existing one or newly created through the assignment.
    story = models.ForeignKey(
        Story,
        blank=True,
        null=True,
        help_text='Which story is this assignment related to?',
    )

    facet = models.ForeignKey(
        Facet,
        blank=True,
        null=True,
        help_text='Which facet is this assignment related to?',
    )

    call = models.ManyToManyField(
        Call,
        blank=True,
        help_text='If this assignment is related to a call, which one?',
    )

    pitch = models.ForeignKey(
        Pitch,
        blank=True,
        null=True,
        help_text='If this assignment is related to a pitch, which one?',
    )

    @property
    def search_title(self):
        return self.name

    def __str__(self):
        return self.name

    # def get_absolute_url(self):
    #     return reverse('assignment_detail', kwargs={'pk': self.id})
