import { useEffect, useState } from "react"
import { GroupCardItem } from '../group/groupCardItem'
import { type GroupsOverview } from '../group/types'

import { apiGetGroupsOverview } from '../../../api/dashboard'
import { AsideBlock } from '../aside'
import { DashboardHeader } from '../header'

export function GroupsPage(){

    const [ groups, setGroups ] = useState<GroupsOverview[]>([])
    
    useEffect(() =>  {
        
        const fetchGroups = async () => {
            const response = await apiGetGroupsOverview();

            setGroups(response);

        };
        fetchGroups();

    }, [])

    return (

        <div className="flex min-h-screen ">
            <AsideBlock/>
            <div className="p-8 w-full">
        
                <main>
                    
                    <DashboardHeader namePage="Группы"/>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {groups.map(group => (
                        <GroupCardItem 
                            key={group.id} 
                            group={group} />
                        ))}
                    </div>
                </main>

            </div>
        </div>
    )
}