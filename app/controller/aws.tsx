import ec2 from "@/config/aws";
import { Instance } from "aws-sdk/clients/ec2";

const listEC2Instances = async ():Promise<(Instance | undefined)[]> => {
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

export default listEC2Instances;
