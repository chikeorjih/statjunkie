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
    getPlayerDetails: (data, details, getGoalies) => {
        let players = [];
        const rawPlayers = data.teams[0].franchise.roster.roster;

        players = rawPlayers.map(player => {
            return (
                {
                    name: player.person.fullName,
                    details: player.person,
                    currentStats:  getCurrentPlayerStats(player.person, details),
                    careerStats: (player.position.code === 'G') ? getGoalieCareerAverages(player.person) : getCareerAverages(player.person)
                }
            );
        });

        if(getGoalies){
            return players.filter(player => player.details.primaryPosition.code === 'G');
        }else{
            return players.filter(player => player.details.primaryPosition.code !== 'G');
        }
        
    },
    getSummary: (players, isGoalies) => {
        return (isGoalies) ? getGoalies(players) : getSkaters(players);
    }
}

function getSkaters(players) {
    return players.map(player => {
        return (
            {
                picture: player.details.id,
                name: {name: player.name, id: player.details.id},
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
                },
                standardDeviation: {
                    goals: player.careerStats.standardDeviation.goals,
                    assists: player.careerStats.standardDeviation.assists,
                    points: player.careerStats.standardDeviation.points
                }
            }
        );
    });
}

function getGoalies(players) {
    return players.map(player => {
        return (
            {
                picture: player.details.id,
                name: player.name,
                position: player.details.primaryPosition.code,
                gp: player.currentStats.games,
                w: player.currentStats.wins,
                l: player.currentStats.losses,
                so: player.currentStats.shutouts,
                gaa: player.currentStats.goalAgainstAverage,
                svP:  player.currentStats.savePercentage,
                sa: player.currentStats.shotsAgainst,
                pkSv: Math.round((player.currentStats.shortHandedSavePercentage)*10)/1000,
                trailingCareerAverages: {
                    saveP: player.careerStats.trailingCareerAverages.saveP,
                    gaa: player.careerStats.trailingCareerAverages.gaa
                }
            }
        );
    });
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
    let trailingStats = {games: 0, goals: 0, assists: 0, points: 0, actuals: []};

    // TODO: fast but there is a better way to do this
    for (let i = 0, len = stats.length; i < len; i++) {
        Object.assign(totalStats,{
            games: totalStats.games + stats[i].stat.games,
            goals: totalStats.goals + stats[i].stat.goals,
            assists: totalStats.assists + stats[i].stat.assists,
            points: totalStats.points + stats[i].stat.points
        });
    }
    for (let x = Math.max((stats.length-4),0), y = stats.length - 1; x < y; x++) {
        Object.assign(trailingStats,{
            games: trailingStats.games + stats[x].stat.games,
            goals: trailingStats.goals + stats[x].stat.goals,
            assists: trailingStats.assists + stats[x].stat.assists,
            points: trailingStats.points + stats[x].stat.points
        });

        trailingStats.actuals.push({
            games: stats[x].stat.games,
            goals: stats[x].stat.goals,
            assists: stats[x].stat.assists,
            points: stats[x].stat.points
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
    let standardDeviation = getStandardDeviation(trailingStats,trailingCareerAverages);

    return {totalStats, careerAverages, trailingCareerAverages, standardDeviation};
}

function getGoalieCareerAverages(person) {
    const stats = person.stats[0].splits.filter((year) => {
        return (
            year.league.id === 133 && year.stat.games > 10
        );
    });
    const trailingYears = (stats.length-1 > 3) ? 4 : stats.length;

    let totalStats = {games:0, saveP: 0, gaa:0};
    let trailingStats = {games:0, saveP: 0, gaa:0};

    for (let i = 0, len = stats.length; i < len; i++) {
        Object.assign(totalStats,{
            games: totalStats.games + stats[i].stat.games,
            saveP: totalStats.saveP + stats[i].stat.savePercentage,
            gaa: totalStats.gaa + stats[i].stat.goalAgainstAverage
        });
    }
    for (let x = Math.max((stats.length-1)-3,0), y = stats.length; x < y; x++) {
        Object.assign(trailingStats,{
            games: trailingStats.games + stats[x].stat.games,
            saveP: trailingStats.saveP + stats[x].stat.savePercentage,
            gaa: trailingStats.gaa + stats[x].stat.goalAgainstAverage
        });
    }
    let trailingCareerAverages = {
        saveP: Math.round((trailingStats.saveP/trailingYears)*1000)/1000, 
        gaa: Math.round((trailingStats.gaa/trailingYears)*1000)/1000
    };
    return {totalStats, trailingCareerAverages};
}

function getStandardDeviation(totals,averages){
    let standardDeviation = {games:0, goals:0, assists: 0, points:0};
    const meanSquared = totals.actuals.map((year) => {
        return ({
            games: year.games,
            goals: Math.pow((getAverage(year.goals,year.games) - averages.goals),2),
            assists: Math.pow((getAverage(year.assists,year.games)  - averages.assists),2),
            points: Math.pow((getAverage(year.points,year.games)  - averages.points),2)
        });
    });
    for (let i = 0, len = meanSquared.length; i < len; i++) {
        Object.assign(standardDeviation,{
            games: Math.round(Math.sqrt((standardDeviation.games + meanSquared[i].games)/meanSquared.length)*100)/100,
            goals: Math.round(Math.sqrt((standardDeviation.goals + meanSquared[i].goals)/meanSquared.length)*100)/100,
            assists: Math.round(Math.sqrt((standardDeviation.assists + meanSquared[i].assists)/meanSquared.length)*100)/100,
            points: Math.round(Math.sqrt((standardDeviation.points + meanSquared[i].points)/meanSquared.length)*100)/100
        });
    }
    return standardDeviation;
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