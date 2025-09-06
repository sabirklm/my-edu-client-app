import { Modal } from 'antd';
import { Clock, FileText, RotateCcw, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ResumeExamDialog = ({ 
  open, 
  onClose, 
  onResume, 
  onStartNew, 
  progressData 
}) => {
  if (!progressData) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(progressData.answers || {}).length;
  const totalQuestions = progressData.examData?.questions?.length || 0;
  const progressPercentage = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <RotateCcw className="w-5 h-5 text-blue-600" />
          <span className="text-lg font-semibold">Resume Previous Attempt?</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
    >
      <div className="py-4">
        {/* Progress Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {progressData.examData?.name || 'Previous Exam Session'}
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                <FileText className="w-4 h-4" />
                <span>Progress</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {answeredCount} / {totalQuestions}
              </div>
              <div className="text-xs text-gray-500">
                {progressPercentage}% completed
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                <Clock className="w-4 h-4" />
                <span>Time Left</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {formatTime(progressData.timeRemaining || 0)}
              </div>
              <div className="text-xs text-gray-500">
                remaining
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Last saved: {formatDistanceToNow(new Date(progressData.lastSaved))} ago</span>
            <span>{progressData.flaggedQuestions?.length || 0} flagged</span>
          </div>
        </div>

        {/* Information Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                Choose your next action
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>You can resume where you left off or start a fresh attempt. Starting new will discard your previous progress.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onResume}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Resume Previous Attempt</span>
          </button>
          
          <button
            onClick={onStartNew}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Start Fresh</span>
          </button>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
        >
          Go Back to Home
        </button>
      </div>
    </Modal>
  );
};

export default ResumeExamDialog;