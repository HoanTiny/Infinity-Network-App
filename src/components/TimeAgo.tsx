/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type TimeAgoProps = {
  date: any;
  message?: boolean;
};

const TimeAgo = ({ date, message = false }: TimeAgoProps) => {
  const timeAgo = dayjs(date).fromNow();
  if (!date) return null;
  const diff = dayjs().diff(dayjs(date), 'day');
  const formattedDate = dayjs(date).format('YYYY-MM-DD');

  if (diff < 7 || message) {
    return <span title={dayjs(date).format('YYYY-MM-DD')}>{timeAgo}</span>;
  }

  return <span title={date}>{formattedDate}</span>;
};

export default TimeAgo;
