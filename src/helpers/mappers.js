const mappers = {
    getTeaminfo: (data) => {
        return (
            {
                city: data.teams[0].locationName,
                teamName: data.teams[0].teamName,
                venue: data.teams[0].venue.name,
                division: data.teams[0].division,
                conference: data.teams[0].conference,
                stats: data.teams[0].teamStats[0].splits[0].stat,
                ranks: data.teams[0].teamStats[0].splits[1].stat,
            }
        );
    },
    getPlayerDetails: (data, details) => {
        let players = [];
        const rawPlayers = data.teams[0].franchise.roster.roster;

        players = rawPlayers.map(player => {
            return (
                {
                    name: player.person.fullName,
                    details: player.person,
                    currentStats:  getCurrentPlayerStats(player.person, details),
                    careerStats: getCareerAverages(player.person)
                }
            );
        });

        //TODO: this filters to skaters, handle goalies next
        return players.filter(player => player.details.primaryPosition.code !== 'G');
    },
    getSummary: (players) => {
        return players.map(player => {
            return (
                {
                    picture: player.details.id,
                    name: player.name,
                    position: player.details.primaryPosition.code,
                    gp: player.currentStats.games,
                    goals: player.currentStats.goals,
                    assists: player.currentStats.assists,
                    points: player.currentStats.points,
                    plusMinus: player.currentStats.plusMinus,
                    projections: {
                        goals: getProjection(player.currentStats.goals,player.currentStats.games),
                        assists: getProjection(player.currentStats.assists,player.currentStats.games),
                        points: getProjection(player.currentStats.points,player.currentStats.games)
                    },
                    averages: {
                        goals: getAverage(player.currentStats.goals,player.currentStats.games),
                        assists: getAverage(player.currentStats.assists,player.currentStats.games),
                        points: getAverage(player.currentStats.points,player.currentStats.games)
                    },
                    careerAverages: {
                        goals: player.careerStats.careerAverages.goals,
                        assists: player.careerStats.careerAverages.assists,
                        points: player.careerStats.careerAverages.points
                    },
                    trailingCareerAverages: {
                        goals: player.careerStats.trailingCareerAverages.goals,
                        assists: player.careerStats.trailingCareerAverages.assists,
                        points: player.careerStats.trailingCareerAverages.points
                    }
                }
            );
        });
    }
}

function getCurrentPlayerStats(person, details) {
    const currentStatsDefault = {games: 0, goals: 0, assists: 0, points: 0, plusMinus: 0,};
    const stats = person.stats[0].splits.filter((year) => {
        return (
            year.season === details.currentSeason && 
            year.team.id === parseInt(details.currentTeam) && 
            year.league.id === 133 //133 = NHL
        );
    });

    return (stats[0] !== undefined) ? stats[0].stat : currentStatsDefault;
}

function getCareerAverages(person) {
    const stats = person.stats[0].splits.filter((year) => {
        return (
            year.league.id === 133
        );
    });
    let totalStats = {games: 0, goals: 0, assists: 0, points: 0 };
    let trailingStats = {games: 0, goals: 0, assists: 0, points: 0 };

    // TODO: fast but there is a better way to do this
    for (let i = 0, len = stats.length; i < len; i++) {
        Object.assign(totalStats,{
            games: totalStats.games + stats[i].stat.games,
            goals: totalStats.goals + stats[i].stat.goals,
            assists: totalStats.assists + stats[i].stat.assists,
            points: totalStats.points + stats[i].stat.points
        });
    }
    for (let x = Math.max((stats.length-1)-3,0), y = stats.length; x < y; x++) {
        Object.assign(trailingStats,{
            games: trailingStats.games + stats[x].stat.games,
            goals: trailingStats.goals + stats[x].stat.goals,
            assists: trailingStats.assists + stats[x].stat.assists,
            points: trailingStats.points + stats[x].stat.points
        });
    }

    let careerAverages = {
        goals: getAverage(totalStats.goals,totalStats.games), 
        assists: getAverage(totalStats.assists,totalStats.games), 
        points: getAverage(totalStats.points,totalStats.games)
    };

    let trailingCareerAverages = {
        goals: getAverage(trailingStats.goals,trailingStats.games), 
        assists: getAverage(trailingStats.assists,trailingStats.games), 
        points: getAverage(trailingStats.points,trailingStats.games)
    };

    return {totalStats, careerAverages, trailingCareerAverages};
}

function getAverage(stat,games) {
    //this check handles a werid case where they track players that didnt play in a regular season game
    const Avg = (stat !== 0 && games !== 0) ? Math.round((stat/games)*100)/100 : 0;
    return Avg;
}

function getProjection(stat,games) {
    stat = (stat !== undefined) ? stat : 0;

    //this check handles a werid case where they track players that didnt play in a regular season game
    return (stat !== 0 && games !== 0) ? Math.round((stat/games) * 82) : 0;
}

export default mappers;