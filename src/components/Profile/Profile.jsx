import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styles from './Profile.module.scss'
import axios from "axios/index";
import DiscussionPosts from '../DiscussionPosts/DiscussionPosts';
import ReactStars from 'react-stars'
import Button from '@material-ui/core/Button/index';
import ProfilePosts from '../ProfilePosts/ProfilePosts'
import { withStyles } from '@material-ui/core/styles/index';
import NavBar from '../NavBar/NavBar'

const API_URL = "http://pet-gallery.herokuapp.com/api/";

class Profile extends Component{

    constructor(props){
        super(props);
        this.state = {
            queryId: this.props.match.params.id,
            id: '',
            name: "",
            location: "",
            contact: "",
            ratings: 0,
            image: "",
            posts:[],
            featured: [],
            currentPanel: 'posts',
            changeAvatar: false,
            localImageURL: ''
        }

        this.login = this.login.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.showFeatured = this.showFeatured.bind(this);
        this.showDiscussions = this.showDiscussions.bind(this);
        this.showPosts = this.showPosts.bind(this);
        this.updateImageSingle = this.updateImageSingle.bind(this);
        this.getProfile = this.getProfile.bind(this);
    }

    login(baseURL){
        // login
        axios.post(baseURL + 'login',{
            username : "raymondlx",
            password : "123456"
        })
            .then((response)=>{
                // console.log(response);
                window.localStorage.setItem('token',response.data.token);
            })
    }

    getUserInfo(baseURL, token){
        // get user info

        const config ={
            headers: {'Authorization': "bearer " + token}
        }

        return axios.get(baseURL + 'user', config)
            .then((response)=>{
                const resData = response.data.data;
                console.log(resData)

                // calculate ratings
                let sum = 0;
                let postsNum = resData.petsCreated.length;

                if (postsNum >=1)
                    sum = 1;
                if (postsNum >=2)
                   sum = 2;
                if (postsNum >= 4)
                   sum = 3;
                if (postsNum >= 6)
                   sum = 4;
                if (postsNum >= 8)
                   sum = 5;

                // update state
                this.setState({
                    id: resData._id,
                    name:resData.name,
                    location: resData.location,
                    ratings: isNaN(sum)? 0:sum,
                    image: resData.imageURL,
                    posts: resData.petsCreated,
                    featured: resData.favoritedPets,
                    contact: resData.email
                });

                return resData;
            })
    }

    // this is used for user to query another user's profile
    getProfile(baseURL, userId){

        axios.get(baseURL + 'user/'+ userId)
            .then((response)=>{
                const resData = response.data.data[0];

                // calculate ratings
                let sum = 0;
                let postsNum = resData.petsCreated.length;

                if (postsNum >=1)
                    sum = 1;
                if (postsNum >=2)
                    sum = 2;
                if (postsNum >= 4)
                    sum = 3;
                if (postsNum >= 6)
                    sum = 4;
                if (postsNum >= 8)
                    sum = 5;


                console.log(resData)
                // update state
                this.setState({
                    id: resData._id,
                    name:resData.name,
                    location: resData.location,
                    ratings: isNaN(sum)? 0:sum,
                    image: resData.imageURL,
                    posts: resData.petsCreated,
                    contact: resData.email,
                    // featured: resData.favoritedPets
                });

                return resData;
            })
    }
    updateImageSingle(){
        let token = window.localStorage.getItem('token');

        let bodyFormData = new FormData();
        let imagefile = document.querySelector('#inputImage');

        bodyFormData.append("image", imagefile.files[0]);

        axios.post(API_URL + 'image/upload/single', bodyFormData,
            { headers: {'Content-Type': 'multipart/form-data' , 'Authorization': "bearer " + token }})
            .then((respnose)=>{
                this.setState({image:respnose.data.data.image})
                window.localStorage.setItem('avatar', respnose.data.data.image);
                console.log(bodyFormData)
            })
    }


    showFeatured() {
        this.setState({ currentPanel: 'featured' });
    }

    showPosts() {
        this.setState({ currentPanel: 'posts' });
    }

    showDiscussions() {
        this.setState({ currentPanel: 'discuss' });
    }

    handleClickOpen = name => event => {
        this.setState({ [name]: true });
    };

    handleClose = name => event =>{
        this.setState({
            [name]: false,
        });
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };



    componentDidMount() {
        window.scrollTo(0,0);
        window.localStorage.setItem('baseURL', API_URL);
        window.localStorage.setItem('previousPage','/profile/'+this.props.match.params.id);
        let token;
        let uid;

        token = window.localStorage.getItem('token');
        uid = window.localStorage.getItem('uid');

        if (uid === this.state.queryId){
            this.getUserInfo(API_URL, token);
        }
        else{
            this.getProfile(API_URL, this.state.queryId);
        }

        // get user info
        //  this.getUserInfo(API_URL, token)

    }


    render(){
        const Avatar = {
            backgroundImage: `url(${this.state.image})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "absolute",
            borderRadius: "100%",
            width: "100%",
            height: "100%"
        }

        return(
            <div>
                <NavBar expanded={false}/>
                <div className={styles.self}>
                    <div className={styles.description}>
                        <h1>{this.state.name}</h1>
                        <h2>{this.state.location}</h2>
                        <h3>{this.state.contact}</h3>
                        <div className={styles.ratings}>
                            <ReactStars
                                value={this.state.ratings}
                                size={25}
                                edit={false}
                            />
                            <p>{this.state.ratings}</p>
                        </div>

                    </div>

                    { this.state.queryId === window.localStorage.getItem('uid')?
                        <label htmlFor="inputImage">
                            <div className={styles.imgContainer}>
                                <div style={Avatar} onClick={this.handleClickOpen('changeAvatar')}/>
                                <Button variant={"contained"} component={"span"} color="secondary"
                                        className={styles.editSpan}>
                                    Edit
                                </Button>
                            </div>
                        </label>
                        :
                        <div className={styles.imgContainer}>
                            <div style={Avatar} onClick={this.handleClickOpen('changeAvatar')}/>
                        </div>

                    }
                    <input id={'inputImage'} type='file' name='image' className={styles.inputButton} onChange={this.updateImageSingle}/>

                </div>

                <div className={styles.buttonGroup}>
                    {this.state.queryId === window.localStorage.getItem('uid')?
                        <button className={styles.buttonContainer} onClick={this.showFeatured}>
                        Featured
                        </button>:
                        <div></div>
                    }
                    <button className={styles.buttonContainer} onClick={this.showPosts}>
                        Posts
                    </button>
                    <button className={styles.buttonContainer} onClick={this.showDiscussions}>
                        Discussion
                    </button>

                </div>
                {
                    this.state.currentPanel === 'posts' ?
                        <ProfilePosts
                            userId = {this.state.id}
                            posts = {this.state.posts}
                            isFeatured={false}
                            isSelf={this.state.queryId === window.localStorage.getItem('uid')}
                        >
                        </ProfilePosts>
                    : this.state.currentPanel === 'featured'?
                        <ProfilePosts
                            userId = {this.state.id}
                            posts = {this.state.featured}
                            isFeatured={true}>
                        </ProfilePosts>
                        : <DiscussionPosts
                            userId={this.state.id}>
                        </DiscussionPosts>
                }
            </div>
        );
    }
}


export default Profile
