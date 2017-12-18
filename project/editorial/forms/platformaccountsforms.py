"""Forms for Platform Accounts and related entities.

"""

from .customwidgets import ArrayFieldSelectMultiple
from django import forms
from django.forms import TextInput, Select
from django.forms.formsets import BaseFormSet

from editorial.models import (
    Project,
    PlatformAccount,
)


# ------------------------------ #
#             Forms              #
# ------------------------------ #


class PlatformAccountForm(forms.ModelForm):
    """Form to create social accounts associated with a user."""

    def __init__(self, *args, **kwargs):
        """Handle passing of org/user info into form."""

        if kwargs:
            org = kwargs.pop('organization')
            user = kwargs.pop('user')
            super(PlatformAccountForm, self).__init__(*args, **kwargs)

            if org:
                # limit team to org users
                self.fields['team'].queryset = org.get_org_users()
                # limit project to org projects or projects on which an org is a collaborator
                self.fields['project'].queryset = Project.objects.filter(
                    Q(organization=self) | Q(collaborate_with=self))

    class Meta:
        model = PlatformAccount
        fields = [
            'name',
            'platform',
            'url',
            'description',
            'team',
            'user',
            'organization',
            'project',
        ]
        widgets = {
            'name': TextInput(attrs={'class': 'form-control', 'placeholder': 'Name'}),
            'platform': Select(attrs={'class': 'c-select', 'id': 'account-platform'}),
            'url': TextInput(attrs={'class': 'form-control', 'placeholder': 'URL'}),
            'description': TextInput(
                attrs={'class': 'form-control', 'placeholder': 'Description'}),
            'team': ArrayFieldSelectMultiple(
                attrs={'class': 'chosen-select', 'id': 'share-with',
                       'data-placeholder': 'Select Team'}),
            'user': Select(attrs={'class': 'c-select', 'id': 'account-user'}),
            'organization': Select(attrs={'class': 'c-select', 'id': 'account-organization'}),
            'project': Select(attrs={'class': 'c-select', 'id': 'account-project'}),
        }


class BasePlatformAccountFormSet(BaseFormSet):

    def clean(self):
        """
        Adds validation to check that no two accounts have the same URL
        and that all accounts have a name and a url.
        """

        if any(self.errors):
            return

        urls = set()

        for form in self.forms:
            if form.cleaned_data:
                name = form.cleaned_data['name']
                url = form.cleaned_data['url']

                # Check that no two links are the same
                if name and url:
                    if url in urls:
                        raise forms.ValidationError(
                            'Accounts must have unique URLs.',
                            code='duplicate_links'
                        )
                    urls.add(url)

                # Check that each account has a name and a url
                if url and not name:
                    raise forms.ValidationError(
                        'All accounts must have a name.',
                        code='missing_name'
                    )
                elif name and not url:
                    raise forms.ValidationError(
                        'All accounts must have a url.',
                        code='missing_url'
                    )


class PlatformAccountFormSet(BasePlatformAccountFormSet):
    """Create a formset."""

    def __init__(self, *args, **kwargs):
        """Get a user for the form."""

        org = kwargs.pop('organization')
        user = kwargs.pop('user')
        super(PlatformAccountFormSet, self).__init__(*args, **kwargs)

        for form in self.forms:
            form.empty_permitted = False

    def _construct_form(self, *args, **kwargs):
        """Add user to each form in the formset."""

        kwargs['user'] = user
        kwargs['organization'] = org
        return super(PlatformAccountFormSet, self)._construct_form(*args, **kwargs)
