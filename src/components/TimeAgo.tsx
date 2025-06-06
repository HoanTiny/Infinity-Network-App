/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const TimeAgo = ({ date }: any) => {
  const timeAgo = dayjs(date).fromNow();
  if (!date) return null;
  const diff = dayjs().diff(dayjs(date), 'day');
  const formattedDate = dayjs(date).format('YYYY-MM-DD HH:mm:ss');

  if (diff < 7) {
    return (
      <span title={dayjs(date).format('YYYY-MM-DD HH:mm:ss')}>{timeAgo}</span>
    );
  }
  return <span title={date}>{formattedDate}</span>;
};

export default TimeAgo;
