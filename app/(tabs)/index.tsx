import { FlatList, ListRenderItem, RefreshControl, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { useCallback, useEffect, useState } from "react";
import listEC2Instances from "../controller/aws";
import { Instance } from "aws-sdk/clients/ec2";
import KeyValueText from "@/components/KeyValueText";

export default function TabOneScreen() {
  const [instances, setInstances] = useState<(Instance | undefined)[]>();
  const [refreshing, setRefreshing] = useState(false);

  const GetInstance = async () => {
    let instances = await listEC2Instances();
    setInstances(instances);
  };

  useEffect(() => {
    GetInstance();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    GetInstance();
    setRefreshing(false);
  }, []);

  const renderInstance: ListRenderItem<Instance | undefined> = (item) => {
    return (
      <View style={styles.instanceContainer}>
        {item.item && (
          <>
            {item.item?.Tags && (
              <KeyValueText
                keyName="Name"
                value={item.item.Tags[0].Value}
                customValueStyle={styles.name}
              />
            )}
            <KeyValueText 
                keyName="Type"
                value={item.item?.InstanceType}
            />
            {item.item?.State && (
              <KeyValueText 
                  keyName="State"
                  value={item.item.State.Name}
                  customValueStyle={item.item.State.Name === "stopped" ? styles.statusRed : item.item.State.Name === "running" ? styles.statusGreen : styles.statusBlue}
              />
            )}
            {item.item?.LaunchTime && (
              <KeyValueText
                keyName="Last Active"
                value={`${new Date(item.item?.LaunchTime).toLocaleDateString("en-GB")} ${new Date(item.item?.LaunchTime).toLocaleTimeString()}`}
              />
            )}
          </>
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} 
          />
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
    fontSize: 20,
    fontWeight: "bold",
  },
  name: {
    fontSize: 20,  
  },
  statusRed: {
    color: "red"
  },
  statusGreen: {
    color: "green"
  },
  statusBlue: {
    color: "blue"
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "80%",
  },
});
