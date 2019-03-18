

import QuestionnaireResponsesPage from './client/QuestionnaireResponsesPage';
import QuestionnaireResponseTable from './client/QuestionnaireResponseTable';
import QuestionnaireResponseDetail from './client/QuestionnaireResponseDetail';

var DynamicRoutes = [{
  'name': 'QuestionnaireResponsePage',
  'path': '/questionnaire-responses',
  'component': QuestionnaireResponsesPage,
  'requireAuth': true
}];

var SidebarElements = [{
  'primaryText': 'QuestionnaireResponses',
  'to': '/questionnaire-responses',
  'href': '/questionnaire-responses'
}];
var AdminSidebarElements = [{
  'primaryText': 'QuestionnaireResponses',
  'to': '/questionnaire-responses',
  'href': '/questionnaire-responses'
}];

export { 
  AdminSidebarElements,
  SidebarElements, 
  DynamicRoutes, 

  QuestionnaireResponsesPage,
  QuestionnaireResponseTable,
  QuestionnaireResponseDetail
};


