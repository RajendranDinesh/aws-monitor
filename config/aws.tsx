import { EC2 } from 'aws-sdk';

const ec2 = new EC2({
  accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_ID,
  secretAccessKey: process.env.EXPO_PUBLIC_AWS_ACCESS_SECRET,
  region: process.env.EXPO_PUBLIC_AWS_REGION,
});

export default ec2;
