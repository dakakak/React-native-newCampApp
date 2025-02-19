import React, { Component } from "react";
import { Text, View, ScrollView, FlatList, Modal, Button, StyleSheet } from "react-native";
import { Card, Icon, Rating, Input } from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { postFavorite } from "../redux/ActionCreators";
import { postComment } from "../redux/ActionCreators";

const mapStateToProps = (state) => {
  return {
    campsites: state.campsites,
    comments: state.comments,
    favorites: state.favorites,
  };
};

const mapDispatchToProps = {
  postFavorite: (campsiteId) => postFavorite(campsiteId),
  postComment: (campsiteId, rating, author, text) => postComment(campsiteId, rating, author, text),
};

function RenderCampsite({ campsite, markFavorite, favorite, onShowModal }) {
  if (campsite) {
    return (
      <Card featuredTitle={campsite.name} image={{ uri: baseUrl + campsite.image }}>
        <Text style={{ margin: 10 }}>{campsite.description}</Text>
        <View style={styles.cardRow}>
          <Icon name={favorite ? "heart" : "heart-o"} type="font-awesome" color="#f50" raised reverse onPress={() => (favorite ? console.log("Already set as a favorite") : markFavorite())} />
          <Icon name={"pencil"} type="font-awesome" color="#5637DD" reverse raised onPress={() => onShowModal()} />
        </View>
      </Card>
    );
  }
  return <View />;
}

function RenderComments({ comments }) {
  const renderCommentItem = ({ item }) => {
    return (
      <View style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.text}</Text>
        <Rating readonly startingValue={item.rating} imageSize={10} style={{ paddingVertical: "5%", alignItems: "flex-start" }}></Rating>
        <Text style={{ fontSize: 12 }}>{`-- ${item.author}, ${item.date}`}</Text>
      </View>
    );
  };

  return (
    <Card title="Comments">
      <FlatList data={comments} renderItem={renderCommentItem} keyExtractor={(item) => item.id.toString()} />
    </Card>
  );
}

class CampsiteInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      rating: 5,
      author: "",
      text: "",
    };
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  handleComment(campsiteId) {
    this.props.postComment(campsiteId, this.state.rating, this.state.author, this.state.text);
    this.toggleModal();
  }

  resetForm() {
    this.setState({
      rating: 5,
      author: "",
      text: "",
    });
  }

  markFavorite(campsiteId) {
    this.props.postFavorite(campsiteId);
  }

  static navigationOptions = {
    title: "Campsite Information",
  };

  render() {
    const campsiteId = this.props.navigation.getParam("campsiteId");
    const campsite = this.props.campsites.campsites.filter((campsite) => campsite.id === campsiteId)[0];
    const comments = this.props.comments.comments.filter((comment) => comment.campsiteId === campsiteId);
    return (
      <ScrollView>
        <RenderCampsite onShowModal={() => this.toggleModal()} campsite={campsite} favorite={this.props.favorites.includes(campsiteId)} markFavorite={() => this.markFavorite(campsiteId)} />
        <RenderComments comments={comments} />
        <Modal animationType={"slide"} transparent={false} visible={this.state.showModal} onRequestClose={() => this.toggleModal()}>
          <View style={styles.modal}>
            <Rating showRating startingValue={this.state.rating} imageSize={40} onFinishRating={(rating) => this.setState({ rating: rating })} style={{ paddingVertical: 10 }}></Rating>
            <Input placeholder="Author" leftIcon={{ name: "user-o", type: "font-awesome" }} leftIconContainerStyle={styles.modalIcon} onChangeText={(value) => this.setState({ author: value })} value={this.author} />
            <Input placeholder="Comment" leftIcon={{ name: "comment-o", type: "font-awesome" }} leftIconContainerStyle={styles.modalIcon} onChangeText={(value) => this.setState({ text: value })} value={this.comment} />
            <View style={{ margin: 10 }}>
              <Button
                onPress={() => {
                  this.handleComment(campsiteId);
                  this.resetForm();
                }}
                color="#5637DD"
                title="Submit"
              />
            </View>
            <View style={{ margin: 10 }}>
              <Button
                onPress={() => {
                  this.toggleModal();
                  this.resetForm();
                }}
                color="#808080"
                title="Cancel"
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cardRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20,
  },
  modal: {
    justifyContent: "center",
    margin: 20,
  },
  modalIcon: {
    paddingRight: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);
