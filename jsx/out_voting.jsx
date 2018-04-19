Chart.defaults.global.defaultFontFamily = "'Abel', sans-serif;";

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}

function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

class OutVoting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataReady: false,
            data: '',
            errorMessage: '',
            userName: getQueryVariable('user'),
            snapshots: props.metadata.snapshots.global
        };
        this.retrieveData = this.retrieveData.bind(this);
        this.getDataUrl = this.getDataUrl.bind(this);
        this.accumulatedVotingTrend = this.accumulatedVotingTrend.bind(this);
        this.weeklyVotingTrend = this.weeklyVotingTrend.bind(this);
        this.weeklyPieCharts = this.weeklyPieCharts.bind(this);
        this.processUser = this.processUser.bind(this);
        this.userProfile = this.userProfile.bind(this);
    }

    componentDidMount() {
        this.retrieveData();
    }

    getDataUrl() {
        return "./output/" + this.state.snapshots[0].path + "/" + this.state.userName + ".json";
    }

    retrieveData() {
        if (this.state.userName) {
            fetch(this.getDataUrl())
            .then(res => res.json())
            .then(
              (result) => {
                this.setState({
                    dataReady: true,
                    data: result
                });
              },
              (error) => {
                this.setState({
                    dataReady: true,
                    errorMessage: error
                });
              })
            .catch((error) => {
                this.setState({
                    dataReady: true,
                    errorMessage: error
                });
            });
        }
    }

    processUser() {
        document.location.href = './?user=' + this.userId.value;
    }

    showFrontPage() {
        return (
            <div>
                <div className='main-panel' style={{padding: 10}}>
                    <div className="input-group input-group-lg" role="group">
                        <span className="input-group-addon" id="sizing-addon1">@</span>
                        <input type="input" ref={(input) => { this.userId = input; }} className="form-control" id="user_id" placeholder="Steemit ID here" defaultValue={this.state.userId}/>
                        <span className="input-group-btn">
                            <button className="btn btn-primary"
                                    onClick={this.processUser}>
                                    Go
                            </button>
                        </span>
                    </div>
                </div>
                <Summary snapshot={this.state.snapshots[0]}/>
            </div>
        );
    }

    accumulatedVotingTrend(data) {
        try {
            return (
                <div>
                    <div className='row'>
                        <div className='col-xs-12 col-md-12 subject-title'>
                            Accumulated Voting Trend
                        </div>
                    </div>
                    <div className='row chart-area'>
                        <div className='col-xs-4 col-md-3 chart_frame'>
                            <div className='chart_cell'>
                                <SimpleLineChart 
                                title='Inverse Simpson Index'
                                chart_id='acc_inverse_simpson' 
                                label={data.map((period) => period.days)}
                                yAxisString='IS index'
                                xAxisString='accumulated days'
                                data={data.map((period) => period.inverse_simpson)}
                                />
                            </div>
                        </div>
                        <div className='col-xs-4 col-md-3 chart_frame'>
                            <div className='chart_cell'>
                                <SimpleLineChart 
                                title='Self voting'
                                chart_id='acc_self_voting' 
                                label={data.map((period) => period.days)}
                                yAxisString='Self voting %'
                                xAxisString='accumulated days'
                                data={data.map((period) => period.self_vote_rate)}
                                />
                            </div>
                        </div>
                        <div className='col-xs-4 col-md-3 chart_frame'>
                            <div className='chart_cell'>
                                <SimpleLineChart 
                                title='Average full-voting per day'
                                chart_id='acc_avg_self_voting_per_day' 
                                label={data.map((period) => period.days)}
                                yAxisString='Avg. full-voting per day'
                                xAxisString='accumulated days'
                                data={data.map((period) => period.avg_full_voting_per_day)}
                                />
                            </div>
                        </div>
                        <div className='col-xs-4 col-md-3 chart_frame'>
                            <div className='chart_cell'>
                                <SimpleLineChart 
                                title='Up-voting count'
                                chart_id='acc_up_voting_count' 
                                label={data.map((period) => period.days)}
                                yAxisString='up-voting count'
                                xAxisString='accumulated days'
                                data={data.map((period) => period.upvcount)}
                                />
                            </div>
                        </div>
                        <div className='col-xs-4 col-md-3 chart_frame'>
                            <div className='chart_cell'>
                                <SimpleLineChart 
                                title='Down-voting count'
                                chart_id='acc_down_voting_count' 
                                label={data.map((period) => period.days)}
                                yAxisString='down-voting count'
                                xAxisString='accumulated days'
                                data={data.map((period) => period.dnvcount)}
                                />
                            </div>
                        </div>
                        <div className='col-xs-4 col-md-3 chart_frame'>
                            <div className='chart_cell'>
                                <SimpleLineChart 
                                title='Unique upvotee count'
                                chart_id='acc_unique_upvotee_count' 
                                label={data.map((period) => period.days)}
                                yAxisString='unique user count'
                                xAxisString='accumulated days'
                                data={data.map((period) => period.upvotee_count)}
                                />
                            </div>
                        </div>
                        <div className='col-xs-4 col-md-3 chart_frame'>
                            <div className='chart_cell'>
                                <SimpleLineChart 
                                title='Unique downvotee count'
                                chart_id='acc_unique_downvotee_count' 
                                label={data.map((period) => period.days)}
                                yAxisString='unique user count'
                                xAxisString='accumulated days'
                                data={data.map((period) => period.dnvotee_count)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } catch (error) {
            this.setState({errorMessage: error});
            return (<div>Critical Error!</div>)
        }
    }

    weeklyVotingTrend(data) {
        try {
            var label = data.map((period) => period.end_date.slice(5)).reverse()
            return (
                <div>
                    <div className='row'>
                        <div className='col-xs-12 col-md-12 subject-title'>
                            Weekly Voting Trend
                        </div>
                    </div>
                    <div className='row chart-area'>
                        <div className='col-xs-4 col-md-3 chart_frame'>
                            <div className='chart_cell'>
                                <SimpleLineChart 
                                title='Inverse Simpson Index'
                                chart_id='weekly_inverse_simpson' 
                                label={label}
                                yAxisString='IS index'
                                data={data.map((period) => period.inverse_simpson).reverse()}
                                />
                            </div>
                        </div>
                        <div className='col-xs-4 col-md-3 chart_frame'>
                            <div className='chart_cell'>
                                <SimpleLineChart 
                                title='Self voting'
                                chart_id='weekly_self_voting' 
                                label={label}
                                yAxisString='Self voting %'
                                data={data.map((period) => period.self_vote_rate).reverse()}
                                />
                            </div>
                        </div>
                        <div className='col-xs-4 col-md-3 chart_frame'>
                            <div className='chart_cell'>
                                <SimpleLineChart 
                                title='Average full-voting per day'
                                chart_id='weekly_avg_self_voting_per_day' 
                                label={label}
                                yAxisString='Avg. full-voting per day'
                                data={data.map((period) => period.avg_full_voting_per_day).reverse()}
                                />
                            </div>
                        </div>
                        <div className='col-xs-4 col-md-3 chart_frame'>
                            <div className='chart_cell'>
                                <SimpleLineChart 
                                title='Up-voting count'
                                chart_id='weekly_up_voting_count' 
                                label={label}
                                yAxisString='up-voting count'
                                data={data.map((period) => period.upvcount).reverse()}
                                />
                            </div>
                        </div>
                        <div className='col-xs-4 col-md-3 chart_frame'>
                            <div className='chart_cell'>
                                <SimpleLineChart 
                                title='Down-voting count'
                                chart_id='weekly_down_voting_count' 
                                label={label}
                                yAxisString='down-voting count'
                                data={data.map((period) => period.dnvcount).reverse()}
                                />
                            </div>
                        </div>
                        <div className='col-xs-4 col-md-3 chart_frame'>
                            <div className='chart_cell'>
                                <SimpleLineChart 
                                title='Unique upvotee count'
                                chart_id='weekly_unique_upvotee_count' 
                                label={label}
                                yAxisString='unique user count'
                                data={data.map((period) => period.upvotee_count).reverse()}
                                />
                            </div>
                        </div>
                        <div className='col-xs-4 col-md-3 chart_frame'>
                            <div className='chart_cell'>
                                <SimpleLineChart 
                                title='Unique downvotee count'
                                chart_id='weekly_unique_downvotee_count' 
                                label={label}
                                yAxisString='unique user count'
                                data={data.map((period) => period.dnvotee_count).reverse()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } catch (error) {
            this.setState({errorMessage: error});
            return (<div>error!</div>)
        }
    }

    weeklyPieCharts(data) {
        try {
            return (
                <div>
                    <div className='row'>
                        <div className='col-xs-12 col-md-12 subject-title'>
                            Weekly Outgoing Voting
                        </div>
                    </div>
                    <div className='row chart-area'>
                        {data.map((period, idx) =>
                            <div className='col-xs-6 col-md-4 chart_frame'>
                                <div className='chart_cell'>
                                    <PieChart 
                                    chart_id={'weekly_top_votee' + idx}
                                    title={period.start_date + ' ~ ' + period.end_date}
                                    data={period.upvotee}
                                    total_vote={period.upvotee_count}
                                    />
                                </div>
                            </div>
                        )}
                        <div className='col-xs-6 col-md-4 chart_frame'>
                            <div className='chart_cell'>
                                <CombinedPieChart 
                                chart_id={'weekly_top_votee_combined'}
                                title={'Merged (outskirts: older)'}
                                data={data.reverse()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } catch (error) {
            this.setState({errorMessage: error});
            return (<div>error</div>);
        }
    }

    accumulatedPieCharts(data) {
        try {
            return (
                <div>
                    <div className='row'>
                        <div className='col-xs-12 col-md-12 subject-title'>
                            Accumulated Outgoing Voting
                        </div>
                    </div>
                    <div className='row chart-area'>
                        {data.map((period, idx) =>
                            <div className='col-xs-6 col-md-4 chart_frame'>
                                <div className='chart_cell'>
                                    <PieChart 
                                    chart_id={'accumulated_top_votee' + idx}
                                    title={period.days + ' days (' + period.start_date + ' ~ ' + period.end_date + ')'}
                                    data={period.upvotee}
                                    total_vote={period.upvotee_count}
                                    />
                                </div>
                            </div>
                        )}
                        <div className='col-xs-6 col-md-4 chart_frame'>
                            <div className='chart_cell'>
                                <CombinedPieChart 
                                chart_id={'accumulated_top_votee_combined'}
                                title={'Merged (outskirts: older)'}
                                data={data.reverse()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } catch (error) {
            this.setState({errorMessage: error});
            return (<div>error</div>);
        }
    }

    userProfile() {
        var user = this.state.data.account;
        var imgPath = "https://steemitimages.com/DQmb3WFxzxYHEdzB7JPC4vVbWFoLqv4ZTPddbS5mjZXPYBv/default1.jpg";
        
        if (user.json_metadata) {
            var jsonMetadata = JSON.parse(user['json_metadata']);
            imgPath = "https://steemitimages.com/240x240/" + jsonMetadata.profile.profile_image;
        }
       
        var ownSp = tools.vestToSp(user.vesting_shares);
        var delegatedSp = tools.vestToSp(user.delegated_vesting_shares);
        var receivedSp = tools.vestToSp(user.received_vesting_shares);
        var currentSp = (ownSp - delegatedSp + receivedSp);
        
        return (
            <div>
                <div className='row'>
                    <div className='col-xs-12 col-md-12 subject-title'>
                        Steemian Profile
                    </div>
                </div>
                <div className='user-profile-panel'>
                    <table>
                        <tr>
                            <td className='user-status'>
                                <div style={{paddingRight: 15}}>
                                    <div style={{
                                        background: "url('" + imgPath + "') 50% 50% no-repeat",
                                        backgroundSize: 'cover',
                                        width: 120,
                                        height: 120,
                                        borderRadius: 15,
                                    }}></div>
                                </div>
                            </td>
                            <td className='user-status'>
                                <span className='user-name'>
                                    <p>{user.name} ({steem.formatter.reputation(user.reputation)})</p>
                                </span>
                                <span className='user-status'>
                                    <p>Total Steem Power : {currentSp.toFixed(0)}</p>
                                    <p>Owning Steem Power : {ownSp.toFixed(0)}</p>
                                    <p>Delegated SP : {delegatedSp.toFixed(0)}</p>
                                    <p>Received Steem Power : {receivedSp.toFixed(0)}</p>
                                    <p><a href={"http://www.steemreports.com/delegation-info/?account=" + user.name} target="_blank">Check Delegation Detail</a></p>
                                    <p>View on <a href={"http://steemit.com/@" + user.name} target="_blank">steemit</a> <a href={"http://steemd.com/@" + user.name} target="_blank">steemd</a>
                                    </p>
                                </span>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        )
    }

    showResult() {
        if (!this.state.errorMessage) {
            return (
            <div className='main-panel'>
            {this.state.dataReady ?
                this.state.data ? (
                    <div class="container-fluid">
                        {this.userProfile()}
                        {this.weeklyVotingTrend(this.state.data.weekly)}
                        {this.weeklyPieCharts(this.state.data.weekly)}
                        {this.accumulatedVotingTrend(this.state.data.accumulated)}
                        {this.accumulatedPieCharts(this.state.data.accumulated)}
                    </div>
                ): (
                    <div>No data</div>
                )
            : (
                    <div><img src="./img/spinner.gif"/></div>
            )}
            </div>);
        } else {
            console.log(this.state.errorMessage);
            return (<div className='main-panel'>Not analyzed user.</div>)
        }
    }

    render() {
        return this.state.userName ? this.showResult() : this.showFrontPage();
    }
}

class SimpleLineChart extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var ctx = document.getElementById(this.props.chart_id).getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
            // The data for our dataset
            data: {
                labels: this.props.label,
                datasets: [{
                    label: this.props.title,
                    fill: false,
                    borderColor: "rgb(255, 99, 132)",
                    backgroundColor: "rgb(255, 99, 132)",
                    data: this.props.data,
                    borderWidth: 1
                }]
            },

            // Configuration options go here
            options: {
                legend: {
                    display: false
                  },
                responsive: true,
                maintainAspectRatio: false,
                title:{
                    display: true,
                    text: this.props.title
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: true,
                            fontSize: 9
                        },
                        scaleLabel: {
                            display: true,
                            labelString: this.props.yAxisString
                        }
                    }],
                    xAxes: [{
                        display: true,
                        scaleLabel: {
							display: this.props.xAxisString ? true : false,
							labelString: this.props.xAxisString
                        },
                        ticks: {
                            fontSize: 9
                        }
                    }]
                }
            }
        });
    }

    render() {
        return (
            <canvas id={this.props.chart_id}></canvas>
        )
    }
};

class PieChart extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {
        var labels = this.props.data.map((votee) => votee.account);
        labels.push((this.props.total_vote - this.props.data.length) + ' users');
        var data = this.props.data.map((votee) => votee.percentage.toFixed(2));
        data.push(100 - data.reduce((a, b) => parseInt(a) + parseInt(b), 0));
        var colorList = palette('tol', data.length).map((hex) => '#' + hex);
        colorList = this.props.data.map((votee) => '#' + intToRGB(hashCode(votee.account)));

        var ctx = document.getElementById(this.props.chart_id).getContext('2d');
        var chart = new Chart(ctx, {
			type: 'doughnut',
			data: {
				datasets: [{
					data: data,
					backgroundColor: colorList
				}],
				labels: labels
			},
			options: {
				responsive: true,
				legend: {
                    display: false				},
				title: {
					display: true,
					text: this.props.title
				},
				animation: {
					animateScale: true,
					animateRotate: true
                },
                tooltips: {
                    callbacks: {
                          label: function(tooltipItem, data) {
                          var label = data.labels[tooltipItem.index];
                          var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                          return label + ': ' + value + "%";
                        }
                    }
                },
                onClick: (event, array) => {
                    var index = array[0]._index;
                    //window.open("./?user=" + labels[index]);
                }
			}
		});
    }
    
    render() {
        return (
            <canvas id={this.props.chart_id}></canvas>
        )
    }
}

class CombinedPieChart extends React.Component {
    constructor(props){
        super(props);
        this.prepareForPeriod = this.prepareForPeriod.bind(this);
    }

    prepareForPeriod(data, total_count) {
        var labels = data.map((votee) => votee.account);
        labels.push((total_count - data.length) + ' users');
        var chartData = data.map((votee) => votee.percentage.toFixed(2));
        chartData.push(100 - chartData.reduce((a, b) => parseInt(a) + parseInt(b), 0));
        var colorList = data.map((votee) => '#' + intToRGB(hashCode(votee.account)));
        return {labels: labels, data: chartData, backgroundColor: colorList};
    }

    componentDidMount() {
        var ctx = document.getElementById(this.props.chart_id).getContext('2d');
        var chart = new Chart(ctx, {
			type: 'doughnut',
			data: {
                datasets: this.props.data.map((period) => this.prepareForPeriod(period.upvotee, period.upvotee_count)),
            },
			options: {
				responsive: true,
				legend: {
                    display: false				},
				title: {
					display: true,
					text: this.props.title
				},
				animation: {
					animateScale: true,
					animateRotate: true
                },
                tooltips: {
                    callbacks: {
                          label: function(tooltipItem, data) {
                          var label = data.datasets[tooltipItem.datasetIndex].labels[tooltipItem.index];
                          var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                          return label + ': ' + value + "%";
                        }
                    }
                }
			}
		});
    }
    
    render() {
        return (
            <canvas id={this.props.chart_id}></canvas>
        )
    }
}

/******************/

var sorter = {
    byName : function(a,b) {
        return a.userid.localeCompare(b.userid);
    },
    bySP : function(a,b) {
        return (b.sp - b.delegated_sp + b.received_sp) - (a.sp - a.delegated_sp + a.received_sp);
    },
    byRshare : function(a,b) {
        return b.acc_rshare[4] - a.acc_rshare[4];
    },
    byIS : function(a,b) {
        return a.acc_is[4] - b.acc_is[4];
    },
    bySelfVote : function(a,b) {
        return b.acc_selfvote_rate[4] - a.acc_selfvote_rate[4];
    },
    byDailyFullVote: function(a,b) {
        return b.acc_avg_fullvote_day[4] - a.acc_avg_fullvote_day[4];
    }
};

class Summary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataReady: false,
            data: '',
            errorMessage: '',
        };
        this.retrieveData = this.retrieveData.bind(this);
        this.getDataUrl = this.getDataUrl.bind(this);
        this.showSummary = this.showSummary.bind(this);
        this.showOperationPage = this.showOperationPage.bind(this);
        this.sortData = this.sortData.bind(this);
    }

    componentDidMount() {
        this.retrieveData();
    }

    getDataUrl() {
        return "./output/"+ this.props.snapshot.path +"/0_summary.json";
    }

    retrieveData() {
        fetch(this.getDataUrl())
        .then(res => res.json())
        .then(
            (result) => {
            this.setState({
                dataReady: true,
                data: result
            });
            },
            (error) => {
            this.setState({
                dataReady: false,
                errorMessage: error
            });
            })
        .catch((error) => {
            this.setState({
                dataReady: false,
                errorMessage: error
            });
        });
    }

    sortData(sorter) {
        this.state.data.sort(sorter);
        this.setState({data: this.state.data});
    }

    showSummary() {
        return (
            <div>
                <div className='subject-title'>
                    Pre-diagnosed User List
                </div>
                <div style={{padding: 10}}>
                    <div className="alert alert-warning" role="alert">
                        <h4>Note</h4>
                        Users listed below are selected for pre-diagnosis, who's STEEM POWER is over 10,000 after the delegation.<br/>
                        <b>Snapshot date:</b> {this.props.snapshot.created}<br/>
                        <br/>
                        <h4>Metrics</h4>
                        <b>SP:</b> Holding STEEM POWER (owning + receiving - delegating)<br/>
                        <b>Used Rshare:</b> Total rshare the user spend for the last 90 days<br/>
                        <b>Inverse Simpson:</b> Voting diversity index for the last 90 days. If this value is too low, the user could have been abusing.<br/>
                        <b>Self Vote:</b> Percentage of self voting for the last 90 days<br/>
                        <b>Daily Full Vote:</b> Avarage daily full voting for the last 90 days. 1 unit = 10,000 voting weight
                    </div>
                </div>
                <div className='main-panel'>
                    <table className="table table-sm table-hover">
                        <thead>
                            <tr>
                                <th><span className="item_name" onClick={() => this.sortData(sorter.byName)}>Name</span></th>
                                <th className="right"><span className="item_name" onClick={() => this.sortData(sorter.bySP)}>SP</span></th>
                                <th className="right"><span className="item_name" onClick={() => this.sortData(sorter.byRshare)}>Used Rshare</span></th>
                                <th className="right"><span className="item_name" onClick={() => this.sortData(sorter.byIS)}>Inverse Simpson</span></th>
                                <th className="right"><span className="item_name" onClick={() => this.sortData(sorter.bySelfVote)}>Self Vote</span></th>
                                <th className="right"><span className="item_name" onClick={() => this.sortData(sorter.byDailyFullVote)}>Daily Full Vote</span></th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.data.map((user) => {
                            return (
                                <tr>
                                    <td><a href={"./?user=" + user.userid}>{user.userid}</a></td>
                                    <td className="right">{user.sp - user.delegated_sp + user.received_sp}</td>
                                    <td className="right">{tools.shortenNumber(user.acc_rshare[4], 2)}</td>
                                    <td className="right">{user.acc_is[4]}</td>
                                    <td className="right">{user.acc_selfvote_rate[4]}%</td>
                                    <td className="right">{user.acc_avg_fullvote_day[4]}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        )

    }

    showOperationPage() {
        return this.state.errorMessage ? (
                <div></div>
            ) : (
                <div></div>
            );
    }

    render() {
        return this.state.dataReady ? this.showSummary() : this.showOperationPage();
    }
}

// Start reading metadata
fetch("./output/metadata.json")
.then(res => res.json())
.then(
    (result) => {
        ReactDOM.render(
            <OutVoting metadata={result} />,
            document.getElementById('content_area')
        );
    },
    (error) => {
        alert("Critical Error! Please retry later.")
    })
.catch((error) => {
    alert("Critical Error! Please retry later.")
});
