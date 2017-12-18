from django.views.generic import CreateView, FormView, UpdateView, DetailView, ListView, \
    DeleteView
from django.shortcuts import redirect
from django.core.urlresolvers import reverse
from actstream import action
from editorial.models import Story

from ..models import Facet, FacetTemplate
from ..forms import (
    FacetTemplateForm,
    get_facet_form_for_template,
    FacetPreCreateForm,
    CommentForm,
    ImageAssetForm,
    DocumentAssetForm,
    AudioAssetForm,
    VideoAssetForm,)


class FacetTemplateCreateView(CreateView):
    """Create a facet template."""

    model = FacetTemplate
    form_class = FacetTemplateForm

    def form_valid(self, form):
        """Save -- but first adding owner and organization."""

        self.object = template = form.save(commit=False)

        # NOTE What's the appropriate way to retrieve these fields?
        # This or defining all the choices in forms?
        form_fields = self.request.POST.getlist('fields')

        template.owner = self.request.user
        template.organization = self.request.user.organization
        template.fields_used = form_fields

        template.save()
        form.save_m2m()

        action.send(self.request.user, verb="created", action_object=self.object)

        return redirect(self.get_success_url())


class FacetTemplateUpdateView(UpdateView):
    """Edit a facet template."""

    model = FacetTemplate
    form_class = FacetTemplateForm

    def get_success_url(self):
        """Record action for activity stream."""

        action.send(self.request.user, verb="edited", action_object=self.object)
        return super(FacetTemplateUpdateView, self).get_success_url()


class FacetCreateView(CreateView):
    """Create a facet (dynamically using right template)."""

    model = Facet

    def get_form_class(self):
        """Get dynamic form based on this template."""

        return get_facet_form_for_template(self.kwargs['template_id'])

    def get_initial(self):
        """Initial data for form:

        - template-id (from URL)
        - name (optionally, from request data)
        - story
        """

        return {'template': self.kwargs['template_id'],
                'name': self.request.GET.get('name', ''),
                'story': self.kwargs['story'],
                'user': self.request.user.id,
                'organization': self.request.user.organization_id,
                }


class FacetPreCreateView(FormView):
    """First step in creating a facet."""

    form_class = FacetPreCreateForm
    template_name = "editorial/facet_precreate_form.html"

    def form_valid(self, form):
        """Redirect to real facet-creation form."""

        template = form.data['template']
        name = form.cleaned_data['name']

        url = reverse("facet_add",
                      kwargs={'template_id': template, 'story': self.kwargs['story']})
        return redirect("{}?name={}".format(url, name))


class FacetUpdateView(UpdateView):
    """Update a facet (dynamically using right template)."""

    model = Facet

    def get_form_class(self):
        """Get dynamic form based on this template."""

        return get_facet_form_for_template(self.object.template_id)

    # def get_form_kwargs(self):
    #     """Pass current story to the form."""
    #
    #     # self.object = self.get_object()
    #     # facet = self.object
    #     kw = super(FacetUpdateView, self).get_form_kwargs()
    #     # kw.update({'story': facet.story})
    #
    #     return kw

    def facet_discussion(self):
        """Get discussion, comments and comment form for the facet."""

        self.object = self.get_object()
        discussion = self.object.discussion
        comments = discussion.comment_set.all()
        form = CommentForm()
        return {'discussion': discussion, 'comments': comments, 'form': form}

    def facet_image_assets(self):
        """Return all image assets associated with a facet and the forms to associate more."""

        self.object = self.get_object()
        images = self.object.get_facet_images()
        org_images = self.object.organization.get_org_image_library()
        uploadform = ImageAssetForm()
        return {'images': images, 'org_images': org_images, 'uploadform': uploadform}

    def facet_document_assets(self):
        """Return all document assets associated with a facet and the forms to associate more."""

        self.object = self.get_object()
        documents = self.object.get_facet_documents()
        org_documents = self.object.organization.get_org_document_library()
        uploadform = DocumentAssetForm()
        return {'documents': documents, 'org_documents': org_documents, 'uploadform': uploadform}

    def facet_audio_assets(self):
        """Return all audio assets associated with a facet and the forms to associate more."""

        self.object = self.get_object()
        audio = self.object.get_facet_audio()
        org_audio = self.object.organization.get_org_audio_library()
        uploadform = AudioAssetForm()
        return {'audio': audio, 'org_audio': org_audio, 'uploadform': uploadform}

    def facet_video_assets(self):
        """Return all video assets associated with a facet and the forms to associate more."""

        self.object = self.get_object()
        videos = self.object.get_facet_video()
        org_videos = self.object.organization.get_org_video_library()
        uploadform = VideoAssetForm()
        return {'videos': videos, 'org_videos': org_videos, 'uploadform': uploadform}


# class FacetDeleteView(DeleteView, FormMessagesMixin):
class FacetDeleteView(DeleteView):
    """View for handling deletion of a facet.

    In this project, we expect deletion to be done via a JS pop-up UI; we don't expect to
    actually use the "do you want to delete this?" Django-generated page. However, this is
    available if useful.
    """

    # FIXME: this would be a great place to use braces' messages; usage commented out for now

    model = Facet
    template_name = "editorial/facet_delete.html"

    # form_valid_message = "Deleted."
    # form_invalid_message = "Please check form."

    def get_success_url(self):
        """Post-deletion, return to the story URL."""

        return Story.objects.get(pk=self.kwargs['story']).get_absolute_url()
