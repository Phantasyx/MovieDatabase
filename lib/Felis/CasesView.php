<?php
/**
 * Created by PhpStorm.
 * User: X
 * Date: 4/6/2017
 * Time: 12:48 AM
 */

namespace Felis;


class CasesView extends View
{
    /**
     * Constructor
     * Sets the page title and any other settings.
     */
    public function __construct(Site $site) {
        $this->setTitle("Felis Investigations");
        $this->addLink("staff.php", "Staff");
        $this->site = $site;

    }
    public function present(){
        $html = <<<HTML
<form class="table" method="post" action="post/cases.php">
	<p>
	<input type="submit" name="add" id="add" value="Add">
	<input type="submit" name="delete" id="delete" value="Delete">
	</p>
	<table>
HTML;
        $cases = new Cases($this->site);
        $all = $cases->getCases();
        foreach($all as $case) {
            $id = $case->getId();
            $num = $case->getNumber();
            $client = $case->getClientName();
            $agent = $case->getAgentName();
            $summary = $case->getSummary();
            $open = $case->getStatus() === ClientCase::STATUS_OPEN ?
                "Open" : "Closed";
            $html .= <<<HTML
		<tr>
			<td><input type="radio" name="user" value="$id"></td>
			<td><a href="case.php?id=$id">$num</a></td>
			<td>$client</td>
			<td>$agent</td>
			<td class="desc"><div>$summary</div></td>
			<td></td>
			<td>$open</td>
		</tr>
HTML;
        }
        $html .= <<<HTML
	</table>
</form>
HTML;
        return $html;
    }
    private $site;
}