Package.describe({
  name: 'clinical:hl7-resource-questionnaire-response',
  version: '1.0.0',
  summary: 'HL7 FHIR Resource - Questionnaire Response',
  git: 'https://github.com/clinical-meteor/hl7-resource-questionnaire-response',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use('meteor-platform');
  api.use('mongo');
  api.use('aldeed:simple-schema@1.3.3');
  api.use('aldeed:collection2@2.3.3');
  api.use('clinical:hl7-resource-datatypes@0.0.1');
  api.use('simple:json-routes@2.1.0');
  api.use('prime8consulting:meteor-oauth2-server@0.0.2')

  api.addFiles('lib/hl7-resource-questionnaire-response.js');
  api.addFiles('server/rest.js', 'server');
  api.addFiles('server/initialize.js', 'server');

  api.export('QuestionnaireResponses');
  api.export('QuestionnaireResponseSchema');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('clinical:hl7-resource-questionnaire-response');
});