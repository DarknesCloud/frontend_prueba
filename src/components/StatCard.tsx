import React from 'react';
import { Card, CardContent, Typography, Box, SvgIcon } from '@mui/material';
import CountUp from 'react-countup';

interface StatCardProps {
  title: string;
  icon: JSX.Element;
  value: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, icon, value }) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Box flexGrow={1}>
            <Typography variant="h6">{title}</Typography>
          </Box>
          <Box>
            <SvgIcon>{icon}</SvgIcon>
          </Box>
        </Box>
        <CountUp start={0} end={value} duration={5} separator="," decimals={0}>
          {({ countUpRef }) => <Typography variant="h4" ref={countUpRef} />}
        </CountUp>
      </CardContent>
    </Card>
  );
};

export default StatCard;
