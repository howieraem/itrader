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
                                <div className="text-avatar">
                                    <span>{this.props.currentUser.email[0]}</span>
                                </div>
                            }
                        </div>
                        <div className="profile-name">
                           <p className="profile-email">{this.props.currentUser.email}</p>
                        </div>
                    </div>
                </div>    
            </div>
        );
    }
}

export default Profile