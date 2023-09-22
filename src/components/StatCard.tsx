import React from 'react';
import { Card, CardContent, Typography, Box, SvgIcon } from '@mui/material';

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
        <Typography variant="h4">{value}</Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
