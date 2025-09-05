import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import CSVImporter from '../components/CSVImporter';

const CSVImportPage: React.FC = () => {
  return (
    <AppLayout
      title="CSV Import & Batch Processing"
      description="Upload a CSV file with leads and generate personalized referral content for each contact"
      navCurrent="app"
    >
      <CSVImporter />
    </AppLayout>
  );
};

export default CSVImportPage;