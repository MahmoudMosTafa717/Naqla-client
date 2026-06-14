import React from 'react';
import PropTypes from 'prop-types';
import ApplicationKanbanColumn from './ApplicationKanbanColumn';

function ApplicationKanbanBoard({ kanbanBuckets }) {
  const { inProgress = [], offers = [], rejected = [] } = kanbanBuckets || {};

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
      <ApplicationKanbanColumn 
        title="In Progress" 
        apps={inProgress} 
      />
      <ApplicationKanbanColumn 
        title="Offers" 
        apps={offers} 
      />
      <ApplicationKanbanColumn 
        title="Rejected" 
        apps={rejected} 
      />
    </div>
  );
}

ApplicationKanbanBoard.propTypes = {
  kanbanBuckets: PropTypes.shape({
    inProgress: PropTypes.arrayOf(PropTypes.object),
    offers: PropTypes.arrayOf(PropTypes.object),
    rejected: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default ApplicationKanbanBoard;
