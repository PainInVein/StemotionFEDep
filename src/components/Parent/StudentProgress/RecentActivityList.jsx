import React from "react";
import { List, Avatar, Tag, Card } from "antd";

const RecentActivityList = ({ activities }) => {
    return (
        <Card title="Recent Activities" variant="borderless" className="h-full">
            <List
                itemLayout="horizontal"
                dataSource={activities}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    icon={item.activityType === "Game" ? <i className="fa-solid fa-play" /> : <i className="fa-solid fa-book-open" />}
                                    className={item.activityType === "Game" ? "bg-purple-500" : "bg-blue-500"}
                                />
                            }
                            title={item.activityName}
                            description={
                                <div className="flex justify-between items-center text-xs">
                                    <span>{new Date(item.activityDate).toLocaleDateString()}</span>
                                    <span>{item.durationMinutes} mins</span>
                                </div>
                            }
                        />
                        <div className="flex flex-col items-end">
                            <Tag color={item.status === "Completed" ? "green" : "orange"}>
                                {item.status}
                            </Tag>
                            {item.score > 0 && <span className="text-xs font-semibold mt-1">Score: {item.score}</span>}
                        </div>
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default RecentActivityList;
