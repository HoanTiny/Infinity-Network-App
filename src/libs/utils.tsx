/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from 'react';

const generateNotificationMessage = (notification: any) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="font-semibold">{notification.author.fullName}</span>
        {/* <span className="text-gray-500">{notification.message}</span> */}
      </div>
      {/* <div className="text-xs text-gray-400">
        {new Date(notification.createdAt).toLocaleTimeString()}
      </div> */}
      {notification.like && (
        <div className="flex items-center gap-1">
          <span className="text-red-500">❤️</span>
          <span>liked your post</span>
        </div>
      )}
      {notification.comment && (
        <div className="flex items-center gap-1">
          <span className="text-blue-500">💬</span>
          <span>commented on your post</span>
        </div>
      )}
    </div>
  );
};

export default generateNotificationMessage;
