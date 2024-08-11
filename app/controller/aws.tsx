import ec2 from "@/config/aws";
import { Instance } from "aws-sdk/clients/ec2";

export const listEC2Instances = async ():Promise<(Instance | undefined)[]> => {
  let instances: (Instance | undefined)[] = [];

  try {
    const data = await ec2.describeInstances().promise();
    if (data) {    
      instances = data.Reservations!.map(
        (reservation) => reservation.Instances
      ).flat();
    }
  } catch (error) {
    console.error("Error fetching EC2 instances", error);
  }

  return instances;
};

export async function startEc2Instance(instanceId: string): Promise<void> {
  try {
    const params = {
      InstanceIds: [instanceId]
    };

    await ec2.startInstances(params).promise();
  } catch (error) {
    console.error('Error starting EC2 instance:', error);
  }
}

export async function stopEc2Instance(instanceId: string): Promise<void> {
  try {
    const params = {
      InstanceIds: [instanceId]
    };

    await ec2.stopInstances(params).promise();
  } catch (error) {
    console.error('Error stopping EC2 instance:', error);
  }
}
