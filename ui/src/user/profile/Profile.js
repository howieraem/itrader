import React, { Component } from 'react';
import './Profile.css';

class Profile extends Component {
    render() {
        return (
            <div className="profile-container">
                <div className="container">
                    <div className="profile-info">
                        <div className="profile-avatar">
                            { 
                                // this.props.currentUser.imageUrl ? (
                                //     <img src={this.props.currentUser.imageUrl} alt={this.props.currentUser.name}/>
                                // ) : (
                                //     <div className="text-avatar">
                                //         <span>{this.props.currentUser.name && this.props.currentUser.name[0]}</span>
                                //     </div>
                                // )
                                <div className="text-avatar">
                                    <span>{JSON.stringify(this.props.currentUser)}</span>
                                </div>
                            }
                        </div>
                        <div className="profile-name">
                           <p className="profile-email">{JSON.stringify(this.props.currentUser)}</p>
                        </div>
                    </div>
                </div>    
            </div>
        );
    }
}

export default Profile