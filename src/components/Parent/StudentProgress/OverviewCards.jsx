import React from "react";
import { Card, Col, Row, Statistic } from "antd";

const OverviewCards = ({ data }) => {
    if (!data) return null;

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
                <Card variant="borderless">
                    <Statistic
                        title="Total Lessons"
                        value={data.totalLessons}
                        prefix={<i className="fa-solid fa-book text-blue-500" />}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Card variant="borderless">
                    <Statistic
                        title="Completed"
                        value={data.completedLessons}
                        prefix={<i className="fa-solid fa-circle-check text-green-500" />}
                        suffix={`/ ${data.totalLessons}`}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Card variant="borderless">
                    <Statistic
                        title="Learning Streak"
                        value={data.learningStreak}
                        prefix={<i className="fa-solid fa-fire text-orange-500" />}
                        suffix="days"
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Card variant="borderless">
                    <Statistic
                        title="Total Points"
                        value={data.totalPoints}
                        precision={0}
                        prefix={<i className="fa-solid fa-trophy text-yellow-500" />}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default OverviewCards;
