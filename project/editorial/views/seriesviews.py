""" Series views for editorial app.

    editorial/views/seriesviews.py
"""

# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render, redirect, get_object_or_404
from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpResponse
from django.utils import timezone
from django.views.generic import TemplateView , UpdateView, DetailView
from django.views.decorators.csrf import csrf_exempt
import datetime
import json
from actstream import action

from editorial.forms import (
    SeriesForm,
    SeriesCommentForm,
    SeriesNoteForm,)

from editorial.models import (
    Series,
    SeriesNote,
    ImageAsset,
    Comment,
    Discussion,
    SeriesNote,)

#----------------------------------------------------------------------#
#   Series Views
#----------------------------------------------------------------------#

def series_list(request):
    """ Displays a filterable table of series.

    Initial display organizes content by series name.
    """

    series = Series.objects.filter(organization=request.user.organization)

    return render(request, 'editorial/serieslist.html', {'series': series})


def series_json(request):
    """Displays JSON of series that a story can be a part of."""

    series_list = Series.objects.filter(organization=request.user.organization)
    series = {}
    for item in series_list:
        series[item.id]=item.name
    print series
    return HttpResponse(json.dumps(series), content_type = "application/json")


def series_new(request):
    """ A logged in user can create a series.

    Series serve as a linking mechanism to connect related stories and to share
    assets between them. Series allow users to create planning notes at a series level
    have planning discussions and upload assets. Assets are always associated with a series
    so they are easily accessible to stories and all facets. This means that even single
    stories technically have a series, but in that case the user does not interact with any
    series interface.
    """

    seriesform = SeriesForm(request=request)
    if request.method == "POST":
        seriesform = SeriesForm(request.POST, request=request)
    if seriesform.is_valid():
        series = seriesform.save(commit=False)
        series.owner = request.user
        series.organization = request.user.organization
        series.creation_date = timezone.now()
        discussion = Discussion.objects.create_discussion("SER")
        series.discussion = discussion
        series.save()
        seriesform.save_m2m()

        # record action for activity stream
        action.send(request.user, verb="created", action_object=series)

        return redirect('series_detail', pk=series.pk)
    else:
        seriesform = SeriesForm(request=request)
    return render(request, 'editorial/seriesnew.html', {'seriesform': seriesform})


def series_detail(request, pk):
    """ The detail page for a series.

    Displays the series' planning notes, discussion, assets, share and collaboration status
    and sensivity status.
    """

    series = get_object_or_404(Series, pk=pk)
    seriesnoteform = SeriesNoteForm()
    seriesnotes = SeriesNote.objects.filter(series=series)[:10]
    seriescommentform = SeriesCommentForm()
    print "SCF: ", seriescommentform
    print "TYPE: ", type(seriescommentform)
    seriescomments = Comment.objects.filter(discussion=series.discussion).order_by('-date')

    return render(request, 'editorial/seriesdetail.html', {
        'series': series,
        'seriesnoteform': seriesnoteform,
        'seriesnotes': seriesnotes,
        'seriescomments': seriescomments,
        'seriescommentform': seriescommentform,
    })


def series_edit(request, pk):
    """ Edit series page."""

    series = get_object_or_404(Series, pk=pk)

    if request.method =="POST":
        seriesform = SeriesForm(data=request.POST, instance=series, request=request)
        if seriesform.is_valid():
            seriesform.save()

            # record action for activity stream
            action.send(request.user, verb="edited", action_object=series)

            return redirect('series_detail', pk=series.id)
    else:
        seriesform = SeriesForm(instance=series, request=request)

    return render(request, 'editorial/seriesedit.html', {
        'series': series,
        'seriesform': seriesform,
        })


def series_delete(request, pk):
    """Delete a series and its related objects then redirect user to series list."""

    if request.method == "POST":
        series = get_object_or_404(Series, pk=pk)
        series.delete()

    return redirect('series_list')
