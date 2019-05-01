import React from 'react'
import './QuestionCell.style.scss'
import axios from 'axios'
import TextField from '@material-ui/core/TextField'
import {getUserInfo} from "../../utils/APIHelpers";
import Avatar from "@material-ui/core/Avatar";
import { Divider, Icon } from 'semantic-ui-react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const API = 'http://pet-gallery.herokuapp.com/api';


export default class QuestionCell extends React.Component {
  constructor(props){
    super(props);
    this.state={
      upvoted: false,
      upvoteCount: 0,
      commentExpanded: false,
      content: '',
      userName: '',
      userImageURL: '',
      authorID: '',
    };
    this.toggleUpvote = this.toggleUpvote.bind(this);
    this.commentButtonOnClick = this.commentButtonOnClick.bind(this);
    this.updateContent = this.updateContent.bind(this);
  }

  componentDidMount() {
    this.updateContent(this.props.question);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.updateContent(nextProps.question);
  }

  updateContent(inputQuestion) {
    this.setState({
      content: inputQuestion.content,
    });
    if (inputQuestion.author === this.state.authorID) {
      return;
    }
    this.setState({authorID: inputQuestion.author})
    axios.get(API + '/user/' + inputQuestion.author)
      .then(data => {
        data = data.data.data[0];


        this.setState({userName: data.name, userImageURL: data.imageURL});
      })
      .catch(e => {});
  }

  toggleUpvote() {
    let upvoteChange = 1;
    if (this.state.upvoted) {
      upvoteChange = -1;
    }
    this.setState({
      upvoted: !this.state.upvoted,
      upvoteCount: this.state.upvoteCount + upvoteChange,
    });
  }


  commentButtonOnClick() {
    this.setState({commentExpanded: !this.state.commentExpanded});
  }

  render() {
    return (
      <div>
        <div className={'question-inner-container'}>
          <Divider/>
          {
            (this.state.userImageURL==='')?
              <Avatar alt={'test name'} className='avatar' /> :
              <Avatar alt={'test name'} src={this.state.userImageURL} className='avatar' />
          }
          <div className={'question-poster-name'}>
            {this.state.userName}
          </div>
          <div className={'question-entry'}>
            {this.state.content}
          </div>
        </div>
        {
          this.state.upvoted?
            <div className={'upvoted'} onClick={this.toggleUpvote}>
              ▲ {this.state.upvoteCount}
            </div> :
            <div className={'upvote'} onClick={this.toggleUpvote}>
              ▲ {this.state.upvoteCount}
            </div>
        }

        <div className={'comment-button'} onClick={this.commentButtonOnClick}>
          <FontAwesomeIcon className='comment-icon' icon="comment-alt"/>
          <div className={'comment-text'}>
            Answers
          </div>
        </div>
      </div>
    )
  }

}