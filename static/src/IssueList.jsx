import React from 'react';
import 'whatwg-fetch';
import PropTypes from 'prop-types';
import {Link} from 'react-router'

import IssueAdd from './IssueAdd.jsx';
import IssueFilter from './IssueFilter.jsx';

const IssueRow = (props) => (
<tr>
    <td><Link to={`/issues/${props.issue._id}`}>{props.issue._id.substr(-4)}</Link></td>
    <td>{props.issue.status}</td>
    <td>{props.issue.owner}</td>
    <td>{props.issue.created}</td>
    <td>{props.issue.effort}</td>
    <td>{props.issue.completionDate? issue.completionDate : ''}</td>
    <td>{props.issue.title}</td>
</tr>
);


IssueRow.propTypes = {
  issue: PropTypes.object.isRequired,
};

function IssueTable (props){
  const issueRows = props.issues.map(issue => <IssueRow key={issue._id} issue={issue} />);

  return (
    <table  className="bordered-table">
     <thead>
      <tr>
       <th>Id</th>
       <th>Title</th>
       <th>Owner</th>
       <th>Created</th>
       <th>Effort</th>
       <th>Completion Date</th>
       <th>Title</th>
      </tr>
    </thead>
    <tbody>{issueRows}</tbody>
   </table>
   );

}


export default class IssueList extends React.Component{
    constructor(){
      super();
      this.state = {issues: []};
      this.createIssue = this.createIssue.bind(this);
    }


    loadData(){
      console.log("****load data2****");
      fetch('/api/issues').then(response=>{

          if(response.ok){
         response.json().then(data => {
          console.log("Total count of records ");
         data.records.foreach(
        issue=>{
          issue.created = new Date(issue.created);
          if(issue.completionDate){
            issue.completionDate = new Date(issue.completionDate);
          }
        })
          this.setState({issues: data.records});
        })
        }else{
        response.json().then(error=>{
        alert("Failed to fetch issues: "+error.message);
        });
        }
        }).catch(err=>{
        alert("Error in fetching data from server: ", err);
          console.log(err);
        });

    }

    createIssue(newIssue){
    const updatedIssue = {
      "id": this.state._id,
      "status": this.state.status,
      "owner": this.state.owner,
      "effort": this.state.effort,
      "created":this.state.created,
      "completionDate":this.state.completionDate,
      "title": this.state.title
    }
      fetch('/api/issues', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newIssue),
        }).then(response =>{
        if(response.ok){
          response.json().then(newIssue=>{
            newIssue.Created = new Date(newIssue.created);
            if(newIssue.completionDate){
              newIssue.completionDate = new Date(newIssue.completionDate);
              }
              const newIssues = this.state.issues.concat(newIssue);
              this.setState({issues: newIssues});
              console.log("**** my client****")
          });
          }else{
            response.json().then(error => {
              alert("Failed to add issue: "+ error.message);
            });
          }
          }).catch(err=>{
            alert("Error in sending data to server: "+err.message);
          });
    }


    render(){
      return (
        <div>
          <h1> Issue Tracker </h1>
          <IssueFilter />
          <hr />
          <IssueTable issues={this.state.issues} />
          <hr />
          <IssueAdd createIssue={this.createIssue}/>
         </div>
      );
    }
}
