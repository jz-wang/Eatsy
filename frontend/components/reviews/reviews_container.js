import { createReview } from '../../actions/review_actions';
import { connect } from 'react-redux';
import Reviews from './reviews';

const mapStateToProps = (state, ownProps) => {
  const parent = ownProps.restaurant ? ownProps.restaurant : ownProps.user;
  return {
          parent: parent,
          currentUser: state.session.currentUser,
          showForm: ownProps.showForm
        };
};

const mapDispatchToProps = dispatch => ({
  createReview: review => dispatch(createReview(review))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reviews);
