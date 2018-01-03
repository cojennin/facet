"""Inbox views for editorial app. """

# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from django.template.loader import render_to_string
from editorial.forms import (
    PrivateMessageForm,
)
from editorial.models import (
    User,
    PrivateMessage,
)


#----------------------------------------------------------------------#
#   Inbox Views
#----------------------------------------------------------------------#

# ACCESS: All users have access to their inbox.
def inbox(request):
    """ Return discussion inbox.

    Displays comments from SeriesPlan Discussions involving user.
    Displays comments from StoryPlan Discussions involving user.
    Displays comments from any Facet Editing Discussion involving user.
    Displays comments from any PrivateDiscussion involving user.
    """

    comments = User.inbox_comments(request.user)

    private_messages_received = User.private_messages_received(request.user)
    private_messages_sent = User.private_messages_sent(request.user)

    return render(request, 'editorial/inbox.html', {
        'comments': comments,
        'private_messages_received': private_messages_received,
        'private_messages_sent': private_messages_sent,
    })


def sent_html(request):
    """Return sent messages"""

    sent_messages = request.user.private_messages_sent()

    sent_messages_html = render_to_string('sent-messages.html', {'sent_messages': sent_messages})

    return HttpResponse(sent_messages_html)


def comments_html(request, comment_type):
    """Return comment feeds."""

    organization = request.user.organization
    # returns all comments involving any user of an Organization
    all_comments = organization.get_org_user_comments()

    if comment_type=="organization":
    # returns all comments made for an Organization
        comments = organization.get_org_comments()
    elif comment_type=="network":
    # returns all comments for any networks an Organization is part of
        comments = organization.get_network_comments()
    elif comment_type=="story":
    # returns all comments for any story of an Organization
        comments = organization.get_story_comments()
    elif comment_type=="series":
    # returns all comments for any series of an Organization
        comments = organization.get_series_comments()
    elif comment_type=="facet":
    # returns all comments for any facets of stories of an Organization
        comments = organization.get_facet_comments()

    comments_html = render_to_string('inbox-comments.html', {
                            'comments': comments,
                            'comment_type': comment_type,
    })

    return HttpResponse(comments_html)


def message_html(request, pk):
    """Return html for displaying a specific message."""
    message = get_object_or_404(PrivateMessage, id=pk)

    message_html = render_to_string('private-message-content.html', {'message': message})
    return HttpResponse(message_html)


def compose_message_html(request):
    """Return private message form."""

    privatemessageform = PrivateMessageForm(request=request)

    compose_message_html = render_to_string('compose-message.html', {'privatemessageform' : privatemessageform})
    return HttpResponse(compose_message_html)


# def inbox_important(request):
#     """Return important messages."""
#
#     return render(request, 'editorial/inbox.html')
#
#
# def inbox_trash(request):
#     """Return trashed messages."""
#
#     return render(request, 'editorial/inbox.html')