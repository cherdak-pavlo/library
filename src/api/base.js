import Airtable from 'airtable';

const SECRET_API_TOKEN = 'pata3QULUXtNkQJ27.3f22999e29b29ceee6eaa101404d3309fc0fae529bca4a7ee3f920f41e123b54';

export const base = new Airtable({ apiKey: SECRET_API_TOKEN }).base('appqMD2APY4JPuqh8');
