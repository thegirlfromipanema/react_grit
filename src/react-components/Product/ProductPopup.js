import React from 'react';
import Popup from '../Navbar/Popup';
import Upvote from './Upvote';
import connectToStores from 'alt-utils/lib/connectToStores';
import ProductStore from '../../stores/ProductStore';
import Actions from '../../actions';

@connectToStores
class ProductPopup extends React.Component {
  constructor() {
    super();
  }

  static getStores() {
    return [ProductStore];
  }

  static getPropsFromStores() {
    return ProductStore.getState();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.status && this.props.status != nextProps.status) {
      Actions.getComments(this.props.pid);
    }
    return true;
  }

  renderHeader() {
    var ReactTooltip = require("react-tooltip");
    return (
      <header style={{backgroundImage: 'url(' + this.props.media + ')'}}>
        <section className="header-shadow">
          <h1>{this.props.name}</h1>
          <p>{this.props.description}</p>
          <section>
            <Upvote {...this.props} />
            <a className="getit-btn" href={this.props.link} target="_blank" data-tip="This is why it is interesting!">Check My Inspiration!</a>
            <ReactTooltip />
          </section>
        </section>
      </header>
    );
  }

  handleComment = (e) => {
    if(e.keyCode === 13 && e.target.value.length > 0) {
      var comment = {
        content: e.target.value,
        name: this.props.user.name,
        avatar: this.props.user.avatar
      }

      Actions.addComment(this.props.pid, comment);
      e.target.value = null;
    }
  };

  handleLogin = () => {
    Actions.login();
  };

  renderBodyDiscussion() {
    return (
      <section className="discussion">
        <h2>Discussion</h2>
        {
          this.props.user
          ?
          <section className="post-comment">
            <img className="medium-avatar" src={this.props.user.avatar}/>
            <input placeholder="What do you think of this plan? Share your advice here!" onKeyUp={this.handleComment} />
          </section>
          :
          <button className="facebook-btn" onClick={this.handleLogin}>Sign in with Facebook to Comment</button>
        }
        {this.renderComments()}
      </section>
    );
  }

  renderBody() {
    return (
      <section className="product-popup-body">
        <main>
          {this.renderBodyDiscussion()}
        </main>
      </section>
    );
  }

  renderComments() {
    return (
      <ul className="comment-list">
        {
          this.props.comments.map(function(comment, idx) {
            return (
              <li key={idx}>
                <img className="medium-avatar" src={comment.avatar}/>
                <section>
                  <strong>{comment.name}</strong>
                  <p>{comment.content}</p>
                </section>
              </li>
            );
          })
        }
      </ul>
    );
  }

  render() {
    return (
      <Popup {...this.props} style="product-popup">
        {this.renderHeader()}
        {this.renderBody()}
      </Popup>
    );
  }
}

export default ProductPopup;
