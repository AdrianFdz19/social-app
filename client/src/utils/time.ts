import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export function formatTimestampRelative(timestamp: number | string): string {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};

export function formatTimestampChatStyle(timestamp: string | number): string {
    const date = new Date(timestamp);

    if (isToday(date)) {
        // Mensaje enviado hoy, retorna la hora en formato 12 horas.
        return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
        // Mensaje enviado ayer.
        return 'yesterday';
    } else {
        // Mensaje enviado en una fecha anterior, retorna la fecha completa.
        return format(date, 'MMM d, yyyy');
    }
}