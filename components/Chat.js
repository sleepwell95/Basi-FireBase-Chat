// @Flow
// !Work for lesson Nr2
//imports:
import React from "react";
import { GiftedChat } from "react-native-gifted-chat"; // 0.3.0

import Fire from "../Fire";

type Props = {
  name?: string
};

class Chat extends React.Component<Props> {
  // Navigation
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || "Chat!"
  });

  state = {
    messages: []
  };
  // Geting user from Firebase
  get user() {
    return {
      name: this.props.navigation.state.params.name,
      _id: Fire.shared.uid
    };
  }

  // Rendering the messages of the user
  // Žinučių atvaizdavimas ekrane su GiftedChat pagalba
  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={Fire.shared.send}
        user={this.user}
      />
    );
  }

  componentDidMount() {
    Fire.shared.on(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message)
      }))
    );
  }
  componentWillUnmount() {
    Fire.shared.off();
  }
}

export default Chat;
