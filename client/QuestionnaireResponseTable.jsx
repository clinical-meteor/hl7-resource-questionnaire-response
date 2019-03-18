import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import { HTTP } from 'meteor/http';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Table } from 'react-bootstrap';
import { Session } from 'meteor/session';
import { has, get } from 'lodash';
import { TableNoData } from 'meteor/clinical:glass-ui'
import PropTypes from 'prop-types';

flattenQuestionnaireResponse = function(questionnaireResponse){
  let result = {
    _id: questionnaireResponse._id,
    title: '',
    identifier: '',
    questionnaire: '',
    status: '',
    subject: '',
    encounter: '',
    author: '',
    date: ''
  };


  // there's an off-by-1 error between momment() and Date() that we want
  // to account for when converting back to a string
  result.date = moment(questionnaireResponse.authored).add(1, 'days').format("YYYY-MM-DD")
  result.encounter = get(questionnaireResponse, 'encounter.reference', '');
  result.subject = get(questionnaireResponse, 'subject.reference', '');
  result.author = get(questionnaireResponse, 'author.reference', '');
  result.identifier = get(questionnaireResponse, 'identifier[0].value', '');

  return result;
}

export class QuestionnaireResponseTable extends React.Component {
  constructor(props) {
    super(props);
  }
  getMeteorData() {
    let data = {
      style: {
        hideOnPhone: {
          visibility: 'visible',
          display: 'table'
        },
        cellHideOnPhone: {
          visibility: 'visible',
          display: 'table',
          paddingTop: '16px',
          maxWidth: '120px'
        },
        cell: {
          paddingTop: '16px'
        },
        avatar: {
          // color: rgb(255, 255, 255);
          backgroundColor: 'rgb(188, 188, 188)',
          userSelect: 'none',
          borderRadius: '2px',
          height: '40px',
          width: '40px'
        }
      },
      selected: [],
      patients: []
    };

    let query = {};
    let options = {};

    // number of items in the table should be set globally
    if (get(Meteor, 'settings.public.defaults.paginationLimit')) {
      options.limit = get(Meteor, 'settings.public.defaults.paginationLimit');
    }
    // but can be over-ridden by props being more explicit
    if(this.props.limit){
      options.limit = this.props.limit;      
    }

    if(this.props.data){
      // console.log('this.props.data', this.props.data);

      if(this.props.data.length > 0){              
        this.props.data.forEach(function(patient){
          data.patients.push(flattenQuestionnaireResponse(patient));
        });  
      }
    } else {
      data.patients = QuestionnaireResponses.find().map(function(patient){
        return flattenQuestionnaireResponse(patient);
      });
    }


    // console.log("QuestionnaireResponseTable[data]", data);
    return data;
  }
  imgError(avatarId) {
    this.refs[avatarId].src = Meteor.absoluteUrl() + 'noAvatar.png';
  }
  rowClick(id){
    Session.set('patientsUpsert', false);
    Session.set('selectedQuestionnaireResponse', id);
    Session.set('patientPageTabIndex', 2);
  }
  renderRowAvatarHeader(){
    if (get(Meteor, 'settings.public.defaults.avatars') && (this.props.showAvatars === true)) {
      return (
        <th className='avatar'>photo</th>
      );
    }
  }
  renderRowAvatar(patient, avatarStyle){
    // console.log('renderRowAvatar', patient, avatarStyle)
    if (get(Meteor, 'settings.public.defaults.avatars') && (this.props.showAvatars === true)) {
      return (
        <td className='avatar'>
          <img src={patient.photo} ref={patient._id} onError={ this.imgError.bind(this, patient._id) } style={avatarStyle}/>
        </td>
      );
    }
  }
  renderSendButtonHeader(){
    if (this.props.showSendButton === true) {
      return (
        <th className='sendButton' style={this.data.style.hideOnPhone}></th>
      );
    }
  }
  renderSendButton(patient, avatarStyle){
    if (this.props.showSendButton === true) {
      return (
        <td className='sendButton' style={this.data.style.hideOnPhone}>
          <FlatButton label="send" onClick={this.onSend.bind('this', this.data.patients[i]._id)}/>
        </td>
      );
    }
  }
  onSend(id){
    let patient = QuestionnaireResponses.findOne({_id: id});

    console.log("QuestionnaireResponseTable.onSend()", patient);

    var httpEndpoint = "http://localhost:8080";
    if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
      httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
    }
    HTTP.post(httpEndpoint + '/QuestionnaireResponse', {
      data: patient
    }, function(error, result){
      if (error) {
        console.log("error", error);
      }
      if (result) {
        console.log("result", result);
      }
    });
  }
  selectQuestionnaireResponseRow(patientId){
    if(typeof(this.props.onRowClick) === "function"){
      this.props.onRowClick(patientId);
    }
  }
  render () {
    let tableRows = [];
    let footer;

    if(this.data.patients.length === 0){
      footer = <TableNoData noDataPadding={ this.props.noDataPadding } />
    } else {
      for (var i = 0; i < this.data.patients.length; i++) {
        tableRows.push(
          <tr key={i} className="patientRow" style={{cursor: "pointer"}} onClick={this.selectQuestionnaireResponseRow.bind(this, this.data.patients[i].id )} >
  
            <td className='identifier' onClick={ this.rowClick.bind('this', this.data.patients[i]._id)} style={this.data.style.cell}>{this.data.patients[i].identifier }</td>
            <td className='title' onClick={ this.rowClick.bind('this', this.data.patients[i]._id)} style={this.data.style.cell}>{this.data.patients[i].title }</td>
            <td className='questionnaire' onClick={ this.rowClick.bind('this', this.data.patients[i]._id)} style={this.data.style.cell}>{this.data.patients[i].questionnaire }</td>
            <td className='encounter' onClick={ this.rowClick.bind('this', this.data.patients[i]._id)} style={this.data.style.cell}>{this.data.patients[i].encounter }</td>
            <td className='subject' onClick={ this.rowClick.bind('this', this.data.patients[i]._id)} style={this.data.style.cell}>{this.data.patients[i].subject }</td>
            <td className='status' onClick={ this.rowClick.bind('this', this.data.patients[i]._id)} style={this.data.style.cell}>{this.data.patients[i].status }</td>
            <td className='date' onClick={ this.rowClick.bind('this', this.data.patients[i]._id)} style={{minWidth: '100px', paddingTop: '16px'}}>{this.data.patients[i].date }</td>
          </tr>
        );
      }
    }
    


    return(
      <div>
        <Table id='patientsTable' hover >
          <thead>
            <tr>
              <th className='identifier'>Identifier</th>
              <th className='title'>Title</th>
              <th className='questionnaire'>Questionnaire</th>
              <th className='subject'>Subject</th>
              <th className='author'>Author</th>
              <th className='encounter'>Encounter</th>
              <th className='status'>Status</th>
              <th className='date' style={{minWidth: '100px'}}>Date</th>
            </tr>
          </thead>
          <tbody>
            { tableRows }
          </tbody>
        </Table>
        { footer }
      </div>
    );
  }
}


ReactMixin(QuestionnaireResponseTable.prototype, ReactMeteorData);
export default QuestionnaireResponseTable;