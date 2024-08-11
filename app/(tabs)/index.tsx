import {
  Animated,
  Button,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  ToastAndroid,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { useCallback, useEffect, useState } from "react";
import {
  listEC2Instances,
  startEc2Instance,
  stopEc2Instance,
} from "../controller/aws";
import { Instance } from "aws-sdk/clients/ec2";
import KeyValueText from "@/components/KeyValueText";
import { Swipeable } from "react-native-gesture-handler";
import SwipeableC from "@/components/Swipeable";

export default function TabOneScreen() {
  const [instances, setInstances] = useState<(Instance | undefined)[]>();
  const [refreshing, setRefreshing] = useState(false);

  const GetInstance = async () => {
    let instances = await listEC2Instances();
    setInstances(instances);
  };

  const StartInstance = async (id: string) => {
    startEc2Instance(id);
    ToastAndroid.show("Started Container", 5)
  };

  const StopInstance = async (id: string) => {
    stopEc2Instance(id);
    ToastAndroid.show("Stopped Container", 5);
  };

  useEffect(() => {
    GetInstance();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    GetInstance();
    setRefreshing(false);
  }, []);

  const renderRightActions = (
    progressAnimatedValue:
      | Animated.AnimatedInterpolation<string | number>
      | undefined,
    dragAnimatedValue:
      | Animated.AnimatedInterpolation<string | number>
      | undefined,
    swipeable: Swipeable | undefined,
    data?: any
  ) => {
    return (
      <View style={styles.rightContainer}>
        <View style={styles.right}>
          <Button title="Start" color={"green"} onPress={() => StartInstance(data.id)} />
        </View>
        <View style={styles.right}>
          <Button title="Stop"  color={"red"} onPress={() => StopInstance(data.id)} />
        </View>
      </View>
    );
  };

  const renderInstance: ListRenderItem<Instance | undefined> = (item) => {
    return (
      <View style={styles.instanceContainer}>
        {item.item && (
          <SwipeableC
            rightActions={renderRightActions}
            data={{ id: item.item.InstanceId }}
          >
            {item.item?.Tags && (
              <KeyValueText
                keyName="Name"
                value={item.item.Tags[0].Value}
                customValueStyle={styles.name}
              />
            )}
            <KeyValueText keyName="Type" value={item.item?.InstanceType} />
            {item.item?.State && (
              <KeyValueText
                keyName="State"
                value={item.item.State.Name}
                customValueStyle={
                  item.item.State.Name === "stopped"
                    ? styles.statusRed
                    : item.item.State.Name === "running"
                    ? styles.statusGreen
                    : styles.statusBlue
                }
              />
            )}
            {item.item?.LaunchTime && (
              <KeyValueText
                keyName="Last Active"
                value={`${new Date(item.item?.LaunchTime).toLocaleDateString(
                  "en-GB"
                )} ${new Date(item.item?.LaunchTime).toLocaleTimeString()}`}
              />
            )}
          </SwipeableC>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Instances</Text>
      <View style={styles.separator} />
      <FlatList
        data={instances}
        renderItem={renderInstance}
        ListEmptyComponent={<Text>No instance found</Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  instanceContainer: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  title: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  name: {
    fontSize: 20,
  },
  statusRed: {
    color: "red",
  },
  statusGreen: {
    color: "green",
  },
  statusBlue: {
    color: "blue",
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "80%",
  },
  rightContainer: {
    gap: 10,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
  },
  right: {
    backgroundColor: "transparent",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  rightText: {
    color: "black",
  },
});
