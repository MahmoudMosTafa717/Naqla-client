import { DndContext } from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import PropTypes from 'prop-types';

function KanbanBoard({ sensors, handleDragEnd, columns }) {
  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-5 overflow-x-auto pb-6 select-none flex-1 items-start scrollbar-thin">
        <KanbanColumn id="applied" title="Applied" count={columns.applied?.length || 0} candidates={columns.applied || []} colorClass="border-t-[var(--color-primary-main)]" />
        <KanbanColumn id="shortlisted" title="Shortlisted" count={columns.shortlisted?.length || 0} candidates={columns.shortlisted || []} colorClass="border-t-sky-500" />
        <KanbanColumn id="interview" title="Interview" count={columns.interview?.length || 0} candidates={columns.interview || []} colorClass="border-t-indigo-500" />
        <KanbanColumn id="offerSent" title="Offer Sent" count={columns.offerSent?.length || 0} candidates={columns.offerSent || []} colorClass="border-t-amber-500" />
        <KanbanColumn id="hired" title="Hired" count={columns.hired?.length || 0} candidates={columns.hired || []} colorClass="border-t-emerald-500" />
        <KanbanColumn id="rejected" title="Rejected" count={columns.rejected?.length || 0} candidates={columns.rejected || []} colorClass="border-t-red-500" />
      </div>
    </DndContext>
  );
}

KanbanBoard.propTypes = {
  sensors: PropTypes.any.isRequired,
  handleDragEnd: PropTypes.func.isRequired,
  columns: PropTypes.shape({
    applied: PropTypes.array,
    shortlisted: PropTypes.array,
    interview: PropTypes.array,
    offerSent: PropTypes.array,
    hired: PropTypes.array,
    rejected: PropTypes.array,
  }).isRequired,
};

export default KanbanBoard;
