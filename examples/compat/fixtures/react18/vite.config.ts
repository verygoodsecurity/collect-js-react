import { createFixtureConfig } from '../../createFixtureConfig';

export default createFixtureConfig({
  fixtureRoot: __dirname,
  reactAlias: 'react-18',
  reactDomAlias: 'react-dom-18',
  reactDomClientAlias: 'react-dom-18/client'
});
