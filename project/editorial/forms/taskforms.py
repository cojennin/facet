"""Forms for Tasks and related entities.

"""

import datetime
from bootstrap3_datetime.widgets import DateTimePicker
from .customwidgets import OurDateTimePicker, ArrayFieldSelectMultiple
from django import forms
from django.utils.safestring import mark_safe
from django.contrib.auth import get_user_model
from django.forms import Textarea, TextInput, RadioSelect, Select, NumberInput, CheckboxInput, CheckboxSelectMultiple, FileField
from django.contrib.postgres.fields import ArrayField
from datetimewidget.widgets import DateTimeWidget
from tinymce.widgets import TinyMCE
from django.db.models import Q
# from django.contrib.staticfiles.templatetags.staticfiles import static


from editorial.models import (
    Project,
    Series,
    Story,
    Task,
    Event,
)


# ------------------------------ #
#          Task Forms            #
# ------------------------------ #

class TaskForm(forms.ModelForm):
    """ Form to create/edit a task. """

    def __init__(self, *args, **kwargs):
        org = kwargs.pop("organization")
        super(TaskForm, self).__init__(*args, **kwargs)
        # TODO make assignment team include org users, partner users and collaborators assigned to content
        self.fields['assigned_to'].queryset = org.get_org_users()
        # limit project, series and stories to those owned by org or part of content and org is collaborator for
        self.fields['project'].queryset = Project.objects.filter(Q(collaborate_with=self) | (Q(owner=self)))
        self.fields['series'].queryset = Series.objects.filter(Q(collaborate_with=self) | (Q(owner=self)))
        self.fields['story'].queryset = Story.objects.filter(Q(collaborate_with=self) | (Q(owner=self)))
        self.fields['event'].queryset = Event.objects.filter(Q(owner=self))
        # set empty labels
        self.fields['status'].empty_label='Task Status'
        self.fields['project'].empty_label='Select a Project'
        self.fields['series'].empty_label='Select a Series'
        self.fields['story'].empty_label='Select a Story'
        self.fields['event'].empty_label='Select an Event'

    due_date = forms.DateTimeField(
        required=False,
        widget=OurDateTimePicker(
            options={'format': 'YYYY-MM-DD HH:mm'},
            attrs={'id': 'task_duedate_picker'}
        )
    )

    class Meta:
        model = Task
        fields = [
            'name',
            'text',
            'assigned_to',
            'status',
            'important',
            'due_date',
            'project',
            'series',
            'story',
            'event',
        ]
        widgets = {
            'name': Textarea(attrs={'class': 'form-control', 'rows':2, 'placeholder': 'Name'}),
            'text': Textarea(attrs={'class': 'form-control', 'id':'task-text', 'rows':20, 'placeholder': 'Details'}),
            'assigned_to': ArrayFieldSelectMultiple(attrs={'class': 'chosen-select form-control facet-select', 'id':'task-team', 'data-placeholder': 'Assign to'}),
            'status': Select(attrs={'class': 'custom-select', 'id':'task-status'}),
            'important': CheckboxInput(attrs={'class': ''}),
            'project': Select(attrs={'class': 'custom-select', 'id':'task-projects'}),
            'series': Select(attrs={'class': 'custom-select', 'id':'task-series'}),
            'story': Select(attrs={'class': 'custom-select', 'id':'task-stories'}),
            'event': Select(attrs={'class': 'custom-select', 'id':'task-events'}),
            }

    class Media:
        css = {
            'all': ('css/bootstrap-datetimepicker.css', 'css/chosen.min.css')
        }
        js = ('scripts/chosen.jquery.min.js',)
