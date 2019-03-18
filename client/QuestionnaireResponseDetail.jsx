import { CardActions, CardText, RaisedButton, TextField } from 'material-ui';
import { get } from 'lodash';

import { Bert } from 'meteor/clinical:alert';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { Session } from 'meteor/session';


let defaultQuestionnaireResponse = {
  "resourceType" : "QuestionnaireResponse"
};

Session.setDefault('questionnaireResponseUpsert', false);
Session.setDefault('selectedQuestionnaireResponse', false);

export class QuestionnaireResponseDetail extends React.Component {
  getMeteorData() {
    let data = {
      questionnaireResponseId: false,
      questionnaireResponse: defaultQuestionnaireResponse
    };

    if (Session.get('questionnaireResponseUpsert')) {
      data.questionnaireResponse = Session.get('questionnaireResponseUpsert');
    } else {
      if (Session.get('selectedQuestionnaireResponse')) {
        data.questionnaireResponseId = Session.get('selectedQuestionnaireResponse');
        console.log("selectedQuestionnaireResponse", Session.get('selectedQuestionnaireResponse'));

        let selectedQuestionnaireResponse = QuestionnaireResponses.findOne({_id: Session.get('selectedQuestionnaireResponse')});
        console.log("selectedQuestionnaireResponse", selectedQuestionnaireResponse);

        if (selectedQuestionnaireResponse) {
          data.questionnaireResponse = selectedQuestionnaireResponse;

          if (typeof selectedQuestionnaireResponse.birthDate === "object") {
            data.questionnaireResponse.birthDate = moment(selectedQuestionnaireResponse.birthDate).add(1, 'day').format("YYYY-MM-DD");
          }
        }
      } else {
        data.questionnaireResponse = defaultQuestionnaireResponse;
      }
    }

    if(process.env.NODE_ENV === "test") console.log("QuestionnaireResponseDetail[data]", data);
    return data;
  }

  render() {
    return (
      <div id={this.props.id} className="questionnaireResponseDetail">
        <CardText>
          {/* <TextField
            id='nameInput'
            ref='name'
            name='name'
            floatingLabelText='name'
            value={ get(this, 'data.questionnaireResponse.name[0].text', '')}
            onChange={ this.changeState.bind(this, 'name')}
            fullWidth
            /><br/>
          <TextField
            id='genderInput'
            ref='gender'
            name='gender'
            floatingLabelText='gender'
            hintText='male | female | other | indeterminate | unknown'
            value={ get(this, 'data.questionnaireResponse.gender', '')}
            onChange={ this.changeState.bind(this, 'gender')}
            fullWidth
            /><br/>
          <TextField
            id='birthdateInput'
            ref='birthdate'
            name='birthdate'
            floatingLabelText='birthdate'
            hintText='YYYY-MM-DD'
            value={ get(this, 'data.questionnaireResponse.birthDate', '')}
            onChange={ this.changeState.bind(this, 'birthDate')}
            fullWidth
            /><br/>
          <TextField
            id='photoInput'
            ref='photo'
            name='photo'
            floatingLabelText='photo'
            value={ get(this, 'data.questionnaireResponse.photo[0].url', '')}
            onChange={ this.changeState.bind(this, 'photo')}
            floatingLabelFixed={false}
            fullWidth
            /><br/>
          <TextField
            id='mrnInput'
            ref='mrn'
            name='mrn'
            floatingLabelText='medical record number'
            value={ get(this, 'data.questionnaireResponse.identifier[0].value', '')}
            onChange={ this.changeState.bind(this, 'mrn')}
            fullWidth
            /><br/> */}
        </CardText>
        <CardActions>
          { this.determineButtons(this.data.questionnaireResponseId) }
        </CardActions>
      </div>
    );
  }
  determineButtons(questionnaireResponseId){
    if (questionnaireResponseId) {
      return (
        <div>
          <RaisedButton id='saveQuestionnaireResponseButton' className='saveQuestionnaireResponseButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} />
          <RaisedButton label="Delete" onClick={this.handleDeleteButton.bind(this)} />
        </div>
      );
    } else {
      return(
        <RaisedButton id='saveQuestionnaireResponseButton'  className='saveQuestionnaireResponseButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
      );
    }
  }

  changeState(field, event, value){
    let questionnaireResponseUpdate;

    if(process.env.TRACE) console.log("questionnaireResponseDetail.changeState", field, event, value);

    // by default, assume there's no other data and we're creating a new questionnaireResponse
    if (Session.get('questionnaireResponseUpsert')) {
      questionnaireResponseUpdate = Session.get('questionnaireResponseUpsert');
    } else {
      questionnaireResponseUpdate = defaultQuestionnaireResponse;
    }



    // if there's an existing questionnaireResponse, use them
    if (Session.get('selectedQuestionnaireResponse')) {
      questionnaireResponseUpdate = this.data.questionnaireResponse;
    }

    switch (field) {
      case "name":
        questionnaireResponseUpdate.name[0].text = value;
        break;
      case "gender":
        questionnaireResponseUpdate.gender = value.toLowerCase();
        break;
      case "birthDate":
        questionnaireResponseUpdate.birthDate = value;
        break;
      case "photo":
        questionnaireResponseUpdate.photo[0].url = value;
        break;
      case "mrn":
        questionnaireResponseUpdate.identifier[0].value = value;
        break;
      default:

    }
    // questionnaireResponseUpdate[field] = value;
    process.env.TRACE && console.log("questionnaireResponseUpdate", questionnaireResponseUpdate);

    Session.set('questionnaireResponseUpsert', questionnaireResponseUpdate);
  }


  // this could be a mixin
  handleSaveButton(){
    if(process.env.NODE_ENV === "test") console.log('handleSaveButton()');
    let questionnaireResponseUpdate = Session.get('questionnaireResponseUpsert', questionnaireResponseUpdate);


    if (questionnaireResponseUpdate.birthDate) {
      questionnaireResponseUpdate.birthDate = new Date(questionnaireResponseUpdate.birthDate);
    }
    if(process.env.NODE_ENV === "test") console.log("questionnaireResponseUpdate", questionnaireResponseUpdate);

    if (Session.get('selectedQuestionnaireResponse')) {
      if(process.env.NODE_ENV === "test") console.log("Updating questionnaireResponse...");

      delete questionnaireResponseUpdate._id;

      // not sure why we're having to respecify this; fix for a bug elsewhere
      questionnaireResponseUpdate.resourceType = 'QuestionnaireResponse';

      QuestionnaireResponses.update({_id: Session.get('selectedQuestionnaireResponse')}, {$set: questionnaireResponseUpdate }, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("QuestionnaireResponses.insert[error]", error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "QuestionnaireResponses", recordId: Session.get('selectedQuestionnaireResponse')});
          // Session.set('questionnaireResponseUpdate', defaultQuestionnaireResponse);
          Session.set('questionnaireResponseUpsert', false);
          Session.set('selectedQuestionnaireResponse', false);
          Session.set('questionnaireResponsePageTabIndex', 1);
          Bert.alert('QuestionnaireResponse added!', 'success');
        }
      });
    } else {
      if(process.env.NODE_ENV === "test") console.log("Creating a new questionnaireResponse...", questionnaireResponseUpdate);

      QuestionnaireResponses.insert(questionnaireResponseUpdate, function(error, result) {
        if (error) {
          if(process.env.NODE_ENV === "test")  console.log('QuestionnaireResponses.insert[error]', error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "QuestionnaireResponses", recordId: result});
          Session.set('questionnaireResponsePageTabIndex', 1);
          Session.set('selectedQuestionnaireResponse', false);
          Session.set('questionnaireResponseUpsert', false);
          Bert.alert('QuestionnaireResponse added!', 'success');
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('questionnaireResponsePageTabIndex', 1);
  }

  handleDeleteButton(){
    QuestionnaireResponses.remove({_id: Session.get('selectedQuestionnaireResponse')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('QuestionnaireResponses.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "QuestionnaireResponses", recordId: Session.get('selectedQuestionnaireResponse')});
        // Session.set('questionnaireResponseUpdate', defaultQuestionnaireResponse);
        Session.set('questionnaireResponseUpsert', false);
        Session.set('questionnaireResponsePageTabIndex', 1);
        Session.set('selectedQuestionnaireResponse', false);
        Bert.alert('QuestionnaireResponse removed!', 'success');
      }
    });
  }
}


ReactMixin(QuestionnaireResponseDetail.prototype, ReactMeteorData);
export default QuestionnaireResponseDetail;