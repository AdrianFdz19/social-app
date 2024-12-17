import { formatDistanceToNow } from 'date-fns';

export function formatTimestampRelative(timestamp: number | string): string {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};
