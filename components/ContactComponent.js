import React, { Component } from "react";
import { Text, ScrollView } from "react-native";
import { Card } from "react-native-elements";

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static navigationOptions = {
    title: "Contact Us",
  };

  render() {
    return (
      <ScrollView>
        <Card title="Contact Information" wrapperStyle={{ margin: 20 }}>
          {/* There's always more than on way to do something.  */}
          <Text>
            {`1 Nucamp Way
Seattle, WA 98001 
U.S.A. 
           
Phone: 1-206-555-1234 
Email: campsites@nucamp.co`}
          </Text>
        </Card>
      </ScrollView>
    );
  }
}

export default Contact;
