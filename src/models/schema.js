export const schema = {
    "models": {
        "Event": {
            "name": "Event",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "date": {
                    "name": "date",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": true,
                    "attributes": []
                },
                "numPlayers": {
                    "name": "numPlayers",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": true,
                    "attributes": []
                },
                "players": {
                    "name": "players",
                    "isArray": true,
                    "type": {
                        "nonModel": "Player"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "teams": {
                    "name": "teams",
                    "isArray": true,
                    "type": {
                        "nonModel": "Team"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "matches": {
                    "name": "matches",
                    "isArray": true,
                    "type": {
                        "nonModel": "Match"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "owner": {
                    "name": "owner",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Events",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "provider": "userPools",
                                "ownerField": "owner",
                                "allow": "owner",
                                "identityClaim": "cognito:username",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    },
    "enums": {
        "MatchStatus": {
            "name": "MatchStatus",
            "values": [
                "NEW",
                "TEAM1WON",
                "TEAM2WON",
                "DRAW"
            ]
        }
    },
    "nonModels": {
        "Player": {
            "name": "Player",
            "fields": {
                "index": {
                    "name": "index",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": true,
                    "attributes": []
                },
                "userid": {
                    "name": "userid",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "stats": {
                    "name": "stats",
                    "isArray": false,
                    "type": {
                        "nonModel": "Stats"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "Stats": {
            "name": "Stats",
            "fields": {
                "numMatches": {
                    "name": "numMatches",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": true,
                    "attributes": []
                },
                "numWon": {
                    "name": "numWon",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": true,
                    "attributes": []
                },
                "numDraws": {
                    "name": "numDraws",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": true,
                    "attributes": []
                },
                "numLost": {
                    "name": "numLost",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": true,
                    "attributes": []
                }
            }
        },
        "Team": {
            "name": "Team",
            "fields": {
                "players": {
                    "name": "players",
                    "isArray": true,
                    "type": {
                        "nonModel": "Player"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "stats": {
                    "name": "stats",
                    "isArray": false,
                    "type": {
                        "nonModel": "Stats"
                    },
                    "isRequired": true,
                    "attributes": []
                }
            }
        },
        "Match": {
            "name": "Match",
            "fields": {
                "teams": {
                    "name": "teams",
                    "isArray": true,
                    "type": {
                        "nonModel": "Team"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": {
                        "enum": "MatchStatus"
                    },
                    "isRequired": true,
                    "attributes": []
                }
            }
        }
    },
    "version": "16cf17795bad3b22c7e7e6b4b82e249e"
};