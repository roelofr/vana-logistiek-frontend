'use client';

import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {timelineOppositeContentClasses,} from '@mui/lab/TimelineOppositeContent';
import {AttachmentType, TicketAttachment} from "@/app/domain";
import {DateTime} from 'luxon';
import UserBadge from "@/app/components/badges/UserBadge";
import Alert from '@mui/material/Alert';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

interface AttachmentComponentProps {
    attachment: TicketAttachment
}

interface TicketTimelineProps {
    attachments: TicketAttachment[];
}

const today = DateTime.now();

function getLocalTime(time: DateTime | string) {
    const timeAsDate = time instanceof DateTime ? time : DateTime.fromISO(time as string);

    if (!timeAsDate.isValid)
        return '??:??';

    if (timeAsDate.hasSame(today, 'day'))
        return timeAsDate.toFormat('t');

    if (timeAsDate.diffNow().get('days') < 3)
        return timeAsDate.toFormat('EEE, t')

    return timeAsDate.toFormat('L LLL, t');
}

function AttachmentDetail({attachment}: AttachmentComponentProps) {
    switch (attachment.type) {
        case AttachmentType.Created:
            return (
                <React.Fragment>
                    <strong>Aangemaakt</strong> door <UserBadge user={attachment.user!}/>
                </React.Fragment>
            )
        case AttachmentType.Comment:
            break;
        case AttachmentType.StatusChange:
            return (
                <React.Fragment>
                    <strong>Status aangepast</strong> door <UserBadge user={attachment.user!}/>
                </React.Fragment>
            )
        case AttachmentType.Assignment:
            return (
                <React.Fragment>
                    <strong>Toegewezen aan</strong> {attachment.description} door <UserBadge user={attachment.user!}/>
                </React.Fragment>
            )

        default:
            return (
                <Alert icon={<QuestionMarkIcon fontSize="inherit"/>} severity="info">
                    Onbekende actie {attachment.type} uitgevoerd door <UserBadge user={attachment.user!}/>
                </Alert>
            );
    }
}

function AttachmentRow({attachment}: AttachmentComponentProps) {
    return (
        <TimelineItem key={attachment.id}>
            <TimelineOppositeContent color="textSecondary">
                {getLocalTime(attachment.createdAt)}
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineDot/>
                <TimelineConnector/>
            </TimelineSeparator>
            <TimelineContent>
                <AttachmentDetail attachment={attachment}/>
            </TimelineContent>
        </TimelineItem>
    )
}

export default function TicketTimeline({attachments}: TicketTimelineProps) {
    return (
        <Timeline
            sx={{
                [`& .${timelineOppositeContentClasses.root}`]: {
                    flex: 0.2,
                },
            }}
        >
            {attachments.map(attachment => <AttachmentRow key={attachment.id} attachment={attachment}/>)}
        </Timeline>
    );
}
