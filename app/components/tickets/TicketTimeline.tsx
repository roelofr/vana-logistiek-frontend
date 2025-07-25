'use client';

import React, {useCallback, useMemo} from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {timelineOppositeContentClasses,} from '@mui/lab/TimelineOppositeContent';
import {AttachmentType, TicketAttachment, TicketStatus} from "@/app/domain";
import {DateTime} from 'luxon';
import UserBadge from "@/app/components/badges/UserBadge";
import Alert from '@mui/material/Alert';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Well from "@/app/components/Well";

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

function statusAsLogistiekTerm(status: string) {
    const statusAsString = TicketStatus[status as TicketStatus];

    switch (statusAsString) {
        case TicketStatus.Created:
            return 'aangemaakt';
        case TicketStatus.Updated:
            return 'bijgewerkt';
        case TicketStatus.Assigned:
            return 'toegewezen';
        case TicketStatus.Resolved:
            return 'opgelost';
        default:
            return 'geen idee';
    }
}

function AttachmentDetail({attachment}: AttachmentComponentProps) {
    switch (attachment.type) {
        case AttachmentType.Created:
            return (
                <Stack direction="row" spacing={2}>
                    <UserBadge user={attachment.user!}/>
                    <Typography variant="body1">
                        heeft dit ticket aangemaakt.
                    </Typography>
                </Stack>
            )
        case AttachmentType.Comment:
            return (
                <Stack direction="column" spacing={2}>
                    <Stack direction="row" spacing={2}>
                        <UserBadge user={attachment.user!}/>
                        <Typography variant="body1">
                            plaatste een opmerking.
                        </Typography>
                    </Stack>
                    <Well>
                        <Typography variant="body2">
                            {attachment.description}
                        </Typography>
                    </Well>
                </Stack>
            );
        case AttachmentType.StatusChange:
            return (
                <Stack direction="row" spacing={2}>
                    <UserBadge user={attachment.user!}/>
                    <Typography variant="body1">
                        heeft de status aangepast naar <strong>{statusAsLogistiekTerm(attachment.description)}</strong>.
                    </Typography>
                </Stack>
            )
        case AttachmentType.Assignment:
            return (
                <Stack direction="row" spacing={2}>
                    <UserBadge user={attachment.user!}/>
                    <Typography variant="body1">
                        heeft het ticket toegewezen aan <strong>{attachment.description}</strong>.
                    </Typography>
                </Stack>
            )

        default:
            return (
                <Alert icon={<QuestionMarkIcon fontSize="inherit"/>} severity="info">
                    Onbekende actie {attachment.type} uitgevoerd door <UserBadge user={attachment.user!}/>
                </Alert>
            );
    }
}

interface AttachmentRowProps extends AttachmentComponentProps {
    isLast: boolean
}

function AttachmentRow({attachment, isLast}: AttachmentRowProps) {
    return (
        <TimelineItem key={attachment.id}>
            <TimelineOppositeContent color="textSecondary">
                {getLocalTime(attachment.createdAt)}
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineDot/>
                {isLast ? null : <TimelineConnector/>}
            </TimelineSeparator>
            <TimelineContent>
                <AttachmentDetail attachment={attachment}/>
            </TimelineContent>
        </TimelineItem>
    )
}

export default function TicketTimeline({attachments}: TicketTimelineProps) {
    const totalLoopCount = useMemo(() => attachments.length, [attachments]);
    const isLast = useCallback((index: number) => totalLoopCount == (index + 1), [totalLoopCount]);
    return (
        <Timeline
            sx={{
                [`& .${timelineOppositeContentClasses.root}`]: {
                    flex: 0.2,
                },
            }}
        >
            {attachments.map((attachment, loop) => <AttachmentRow key={attachment.id} attachment={attachment}
                                                                  isLast={isLast(loop)}/>)}
        </Timeline>
    );
}
