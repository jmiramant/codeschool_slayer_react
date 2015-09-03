var React = require('react'),
  $ = require('jQuery'),
  _ = require('lodash');

var QuizResponse = React.createClass({
  getInitialState: function() {
    return {
      active: false
    };
  },

  btnResponse: function() {
    this.state.active = true
    return this.props.onClick();
  },

  render: function() {
    return <button onClick={this.btnResponse}>
      <span>{this.props.text}</span>
    </button>
  }
});

var Quiz = React.createClass({

  getInitialState: function() {
    return {
        answers: [],
        complete: false,
        questionNumber: 0,
        question: 'feching question',
        apiResp: {}
    };
  },

  componentDidMount: function () {
    $.get('/api/questions', function(result) {
      var apiResp = result[this.state.questionNumber];
      if (this.isMounted()) {
        this.setState({
          apiResp: result,
          answers: apiResp.answers,
          question: apiResp.question
        });
      }
    }.bind(this));
  },

  handleResponse: function () {
    var resp = _.filter(this.refs, function(item, i){
      return item.state.active === true;
    })[0];
    console.log('And your answer is: ' + resp.props.answer);
    resp.state.active = false;
    this.incrementQuestionState();
  },

  incrementQuestionState: function() {
    var next = this.state.apiResp[this.state.questionNumber + 1];
    if (next) {
      this.setState({
        questionNumber: (this.state.questionNumber + 1),
        answers: next.answers,
        question: next.question
      });
    } else {
      this.setState({
        answers: [],
        question: 'Quiz Complete'
      });
    }
  },

  render: function () {
    return (
      <div>
        <div className='question'>{this.state.question}</div>
        <div className="response-buttons">
          {this.state.answers.map(function(item, i) {
            var boundClick = this.handleResponse.bind(this, i);
            return (
              <QuizResponse text={item.text} answer={item.answer} onClick={boundClick} key={i} ref={item.answer} />
            );
          }, this)}
        </div>
      </div>
    );
  }
});

var Home = React.createClass({
	render: function() {
		return (
      <div className="quiz">
        <Quiz/>
      </div>
		);
	}
});

module.exports = Home;