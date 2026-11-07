export interface DiagramNode {
  title: string;
  detail?: string;
  annotation?: string;
}

interface Diagram {
  heading: string;
  summary: string;
  columns: DiagramNode[][];
  flow?: 'forward' | 'two-way' | 'broken';
  finalForward?: boolean;
}

interface ProposedCase {
  slug: string;
  title: string;
  tabLabel: string;
  category: string;
  client: string;
  before: Diagram;
  after: Diagram;
}

export const proposedCases: ProposedCase[] = [
  {
    slug: 'healthquest-connected-operations',
    title: 'Connected lab operations',
    tabLabel: 'Business Intelligence',
    category: 'Infrastructure, integration and reporting',
    client: 'A medical laboratory in Southern California',
    before: {
      heading: 'Information in separate systems',
      summary: 'Information spread across separate operational systems.',
      columns: [[{title: 'Laboratory Data'}], [{title: 'Billing Data'}], [{title: 'Customer-Service Data'}]],
    },
    after: {
      heading: 'Connected data and clearer visibility',
      summary: 'Connected reporting · Clearer operational visibility',
      flow: 'forward',
      columns: [
        [{title: 'Laboratory Data'}, {title: 'Billing Data'}, {title: 'Customer-Service Data'}],
        [{title: 'Connected Data Warehouse'}],
        [{title: 'BI Dashboards & Reports'}],
        [{title: 'Clearer Operational Visibility'}],
      ],
    },
  },
  {
    slug: 'sbh-integration-and-licensing',
    title: 'Integration & licensing',
    tabLabel: 'Customer Service',
    category: 'Middleware and licensing review',
    client: 'A laboratory and related behavioral health organizations',
    before: {
      heading: 'Lab information across separate systems',
      summary: 'The team searches across separate systems for laboratory information.',
      flow: 'forward',
      columns: [
        [{title: 'Customer-Service Team'}],
        [{title: 'Look Across Separate Systems'}],
        [{title: 'Find Laboratory Information'}],
      ],
    },
    after: {
      heading: 'Lab information within reach',
      summary: 'Current laboratory information is available to the customer-service team.',
      flow: 'forward',
      columns: [
        [{title: 'LabDaq'}],
        [{title: 'Updates Every 15 Minutes'}],
        [{title: 'Dynamics 365 Customer Service'}],
        [{title: 'Lab Information Available to the Team'}],
      ],
    },
  },
  {
    slug: 'monarch-laboratory-buildout',
    title: 'A new laboratory facility',
    tabLabel: 'LIS–EMR Integration',
    category: 'Network, cloud and connected systems',
    client: 'A laboratory moving to a new facility',
    before: {
      heading: 'Separate, costly interfaces',
      summary: 'Each connection is handled as a separate, costly interface.',
      flow: 'forward',
      columns: [
        [{title: 'EMR Systems'}],
        [{title: 'Separate, Costly Interfaces'}],
        [{title: 'Laboratory System'}],
      ],
    },
    after: {
      heading: 'Reusable integration platform',
      summary: 'Reusable connectivity · Approximately $70,000 in annual savings',
      flow: 'two-way',
      finalForward: true,
      columns: [
        [{title: 'EMR Systems'}],
        [{title: 'Reusable Integration Platform'}],
        [{title: 'Laboratory System'}],
        [{title: 'Approximately $70,000 in Annual Savings'}],
      ],
    },
  },
];
